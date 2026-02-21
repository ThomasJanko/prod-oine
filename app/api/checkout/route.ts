/**
 * POST /api/checkout
 * Validates cart server-side, creates Stripe Checkout session, returns redirect URL.
 * Never trust client prices; always recompute from product + options.
 */

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/env";
import { validateCartItems, createCheckoutSession } from "@/services/stripeService";

export async function POST(request: NextRequest) {
  if (!config.stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }
  let body: { items: { productId: string; productName: string; selectedOptions: Record<string, string>; quantity: number }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { items } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  try {
    const validated = await validateCartItems(items);
    const session = await createCheckoutSession({
      validatedItems: validated,
      successUrl: `${config.appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${config.appUrl}/checkout`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
