/**
 * Product read/write.
 */

import { connectDb } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import type { Product as ProductType } from "@/types";

function mapDoc(doc: { _id: unknown; collectionName: string; title: string; description?: string; basePrice: number; options: unknown[]; defaultOptions?: unknown; active?: boolean; createdAt?: Date; updatedAt?: Date }) {
  return {
    _id: String(doc._id),
    collectionName: doc.collectionName,
    title: doc.title,
    description: doc.description,
    basePrice: doc.basePrice,
    options: doc.options.map((o: { _id: unknown; key: string; label: string; choices: unknown[] }) => ({
      _id: String(o._id),
      key: o.key,
      label: o.label,
      choices: o.choices,
    })),
    defaultOptions: doc.defaultOptions,
    active: doc.active,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  } as ProductType;
}

export async function getProductById(id: string): Promise<ProductType | null> {
  await connectDb();
  const doc = await Product.findById(id).lean();
  if (!doc) return null;
  return mapDoc(doc as Parameters<typeof mapDoc>[0]);
}

/** List products. For store: active only. For admin: pass includeInactive true. */
export async function listProducts(includeInactive = false): Promise<ProductType[]> {
  await connectDb();
  const query = includeInactive ? {} : { active: { $ne: false } };
  const docs = await Product.find(query).sort({ collectionName: 1, title: 1 }).lean();
  return docs.map((d) => mapDoc(d as Parameters<typeof mapDoc>[0]));
}
