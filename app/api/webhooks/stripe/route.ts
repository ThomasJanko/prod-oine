/**
 * Stripe webhook: checkout.session.completed.
 * Creates order with full configuration snapshot; marks payment as paid.
 * Uses raw body for signature verification.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { config } from "@/config/env";
import { createOrder } from "@/services/orderService";

const stripe = new Stripe(config.stripeSecretKey);

export async function POST(request: NextRequest) {
  if (!config.stripeWebhookSecret) {
    return NextResponse.json({ error: "Webhook secret not set" }, { status: 500 });
  }
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, config.stripeWebhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_email ?? session.customer_details?.email;
  if (!email) {
    return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
  }
  const itemsSnapshot = session.metadata?.itemsSnapshot;
  if (!itemsSnapshot) {
    return NextResponse.json({ error: "Missing items snapshot" }, { status: 400 });
  }
  let items: {
    productId: string;
    productName: string;
    selectedOptions: Record<string, string>;
    quantity: number;
    unitPriceCents: number;
  }[];
  try {
    items = JSON.parse(itemsSnapshot);
  } catch {
    return NextResponse.json({ error: "Invalid items snapshot" }, { status: 400 });
  }
  const totalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const metadataTotal = Number(session.metadata?.totalCents ?? 0);
  if (totalCents !== metadataTotal) {
    return NextResponse.json({ error: "Total mismatch" }, { status: 400 });
  }
  await createOrder({
    stripeSessionId: session.id,
    stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    email,
    status: "paid",
    totalCents,
    items: items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      selectedOptions: i.selectedOptions,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
    })),
  });
  return NextResponse.json({ received: true });
}
