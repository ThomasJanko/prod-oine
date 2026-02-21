/**
 * Product model. No slug; identified by _id. Options embedded for configurable products.
 * Clear cached model so schema changes (e.g. name/slug → title/collectionName) apply after restart.
 */

import mongoose, { Schema, model, models } from "mongoose";

if (mongoose.models?.Product) {
  delete (mongoose.models as Record<string, mongoose.Model<unknown>>).Product;
}

const ProductOptionChoiceSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    priceModifier: { type: Number, required: true, default: 0 },
    imageSuffix: { type: String },
  },
  { _id: false }
);

const ProductOptionSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    choices: [ProductOptionChoiceSchema],
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    collectionName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    basePrice: { type: Number, required: true },
    options: { type: [ProductOptionSchema], default: [] },
    defaultOptions: { type: Schema.Types.Mixed },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ collectionName: 1 });
ProductSchema.index({ title: 1 });
ProductSchema.index({ active: 1 });

export const Product =
  models?.Product ?? model<mongoose.Document & import("@/types").Product>("Product", ProductSchema);
