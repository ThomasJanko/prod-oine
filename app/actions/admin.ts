"use server";

import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { connectDb } from "@/lib/mongodb";
import { Product } from "@/lib/models";
import type { ProductOption } from "@/types";

type ProductOptionInput = Omit<ProductOption, "_id"> & { _id?: string };

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function parsePrice(raw: string): number {
  const n = Math.round(Number.parseFloat(raw || "0") * 100);
  return Number.isNaN(n) || n < 0 ? 0 : n;
}

/** Create product. Image saved to public/products/{id}/base.jpg */
export async function createProduct(formData: FormData) {
  const collectionName = (formData.get("collectionName") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || undefined;
  const basePrice = parsePrice(formData.get("basePrice") as string);
  const baseImage = formData.get("baseImage") as File | null;

  if (!collectionName || !title) return { error: "Collection et titre requis." };

  await connectDb();
  const doc = await Product.create({
    collectionName,
    title,
    description,
    basePrice,
    options: [],
    active: true,
  });
  const productId = String(doc._id);

  if (baseImage?.size > 0) {
    const type = baseImage.type?.toLowerCase();
    if (!type || !ALLOWED_IMAGE_TYPES.has(type)) {
      return { error: "Image non acceptée. Utilisez JPG, PNG ou WebP." };
    }
    const dir = path.join(process.cwd(), "public", "products", productId);
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await baseImage.arrayBuffer());
    await writeFile(path.join(dir, "base.jpg"), buf);
  }

  return { id: productId };
}

/** Update product and optionally replace image. */
export async function saveProduct(formData: FormData) {
  const productId = (formData.get("productId") as string)?.trim();
  const collectionName = (formData.get("collectionName") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || undefined;
  const basePrice = parsePrice(formData.get("basePrice") as string);
  const baseImage = formData.get("baseImage") as File | null;

  if (!productId || !collectionName || !title) return { error: "Données requises manquantes." };

  await connectDb();
  const doc = await Product.findById(productId);
  if (!doc) return { error: "Produit introuvable." };

  doc.collectionName = collectionName;
  doc.title = title;
  doc.description = description;
  doc.basePrice = basePrice;
  await doc.save();

  if (baseImage?.size > 0) {
    const type = baseImage.type?.toLowerCase();
    if (!type || !ALLOWED_IMAGE_TYPES.has(type)) {
      return { error: "Image non acceptée. Utilisez JPG, PNG ou WebP." };
    }
    const dir = path.join(process.cwd(), "public", "products", productId);
    await mkdir(dir, { recursive: true });
    const buf = Buffer.from(await baseImage.arrayBuffer());
    await writeFile(path.join(dir, "base.jpg"), buf);
  }

  return {};
}

export async function deleteProduct(id: string) {
  await connectDb();
  const doc = await Product.findByIdAndDelete(id);
  if (!doc) return { error: "Produit introuvable." };
  const dir = path.join(process.cwd(), "public", "products", id);
  try {
    await rm(dir, { recursive: true });
  } catch {
    // ignore missing folder
  }
  return {};
}

export async function setProductActive(id: string, active: boolean) {
  await connectDb();
  const doc = await Product.findByIdAndUpdate(id, { active }, { new: true });
  if (!doc) return { error: "Produit introuvable." };
  return {};
}
