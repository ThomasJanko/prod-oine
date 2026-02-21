/**
 * Order model. Stores full configuration snapshot in items (no reliance on current product state).
 * Indexes: stripeSessionId (unique), email, status, createdAt for lookups.
 */

import mongoose, { Schema, model, models } from "mongoose";

const OrderItemSnapshotSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    selectedOptions: { type: Schema.Types.Mixed, required: true },
    quantity: { type: Number, required: true },
    unitPriceCents: { type: Number, required: true },
    imagePath: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    stripeSessionId: { type: String, sparse: true, unique: true },
    stripePaymentIntentId: { type: String },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    totalCents: { type: Number, required: true },
    items: [OrderItemSnapshotSchema],
  },
  { timestamps: true }
);

OrderSchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });
OrderSchema.index({ email: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order =
  models?.Order ?? model<mongoose.Document & import("@/types").Order>("Order", OrderSchema);
