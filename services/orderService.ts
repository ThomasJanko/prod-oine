/**
 * Order creation and lookup. Used by Stripe webhook and admin.
 */

import { connectDb } from "@/lib/mongodb";
import { Order } from "@/lib/models";
import type { Order as OrderType, OrderItemSnapshot } from "@/types";

export async function createOrder(data: {
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  email: string;
  status: OrderType["status"];
  totalCents: number;
  items: OrderItemSnapshot[];
}): Promise<OrderType> {
  await connectDb();
  const doc = await Order.create(data);
  return {
    _id: String(doc._id),
    stripeSessionId: doc.stripeSessionId,
    stripePaymentIntentId: doc.stripePaymentIntentId,
    email: doc.email,
    status: doc.status,
    totalCents: doc.totalCents,
    items: doc.items,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function updateOrderStatus(
  stripeSessionId: string,
  status: OrderType["status"]
): Promise<boolean> {
  await connectDb();
  const result = await Order.updateOne(
    { stripeSessionId },
    { $set: { status, updatedAt: new Date() } }
  );
  return result.modifiedCount > 0;
}

export async function getOrderByStripeSessionId(
  stripeSessionId: string
): Promise<OrderType | null> {
  await connectDb();
  const doc = await Order.findOne({ stripeSessionId }).lean();
  if (!doc) return null;
  return {
    _id: String(doc._id),
    stripeSessionId: doc.stripeSessionId,
    stripePaymentIntentId: doc.stripePaymentIntentId,
    email: doc.email,
    status: doc.status,
    totalCents: doc.totalCents,
    items: doc.items,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listOrders(limit = 50): Promise<OrderType[]> {
  await connectDb();
  const docs = await Order.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  return docs.map((doc) => ({
    _id: String(doc._id),
    stripeSessionId: doc.stripeSessionId,
    stripePaymentIntentId: doc.stripePaymentIntentId,
    email: doc.email,
    status: doc.status,
    totalCents: doc.totalCents,
    items: doc.items,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  })) as OrderType[];
}
