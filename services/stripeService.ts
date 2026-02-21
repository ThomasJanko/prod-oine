/**
 * Stripe Checkout: create session and validate line items server-side.
 * Price is always computed from product + options; never trust client.
 */

import Stripe from "stripe";
import { config } from "@/config/env";
import { getProductById } from "./productService";
import { computeUnitPriceCents } from "@/lib/pricing";
import { getProductImagePath } from "@/lib/images";
import type { CartItem, SelectedOptions } from "@/types";

const stripe = new Stripe(config.stripeSecretKey);

export interface ValidatedLineItem {
  productId: string;
  productName: string;
  selectedOptions: SelectedOptions;
  quantity: number;
  unitPriceCents: number;
  imagePath?: string;
}

/**
 * Validates cart items against DB and returns server-computed prices.
 */
export async function validateCartItems(
  items: Pick<CartItem, "productId" | "productName" | "selectedOptions" | "quantity">[]
): Promise<ValidatedLineItem[]> {
  const result: ValidatedLineItem[] = [];
  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.productId}`);
    const unitPriceCents = computeUnitPriceCents(product, item.selectedOptions);
    const imagePath = getProductImagePath(product._id);
    result.push({
      productId: product._id,
      productName: product.title,
      selectedOptions: item.selectedOptions,
      quantity: item.quantity,
      unitPriceCents,
      imagePath,
    });
  }
  return result;
}

/**
 * Create Stripe Checkout session. Expects already-validated line items.
 * Metadata stores order fingerprint for webhook (e.g. totalCents, item count).
 */
export async function createCheckoutSession(params: {
  validatedItems: ValidatedLineItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}): Promise<Stripe.Checkout.Session> {
  const { validatedItems, successUrl, cancelUrl, customerEmail } = params;
  const totalCents = validatedItems.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map(
    (i) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: i.productName,
          description: Object.entries(i.selectedOptions)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", "),
          images: i.imagePath ? [config.appUrl + i.imagePath] : undefined,
        },
        unit_amount: i.unitPriceCents,
      },
      quantity: i.quantity,
    })
  );
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      totalCents: String(totalCents),
      itemCount: String(validatedItems.length),
      // Store snapshot for webhook: JSON string of items (ids, options, qty, unitPrice)
      itemsSnapshot: JSON.stringify(
        validatedItems.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          selectedOptions: i.selectedOptions,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
        }))
      ),
    },
  });
  return session;
}
