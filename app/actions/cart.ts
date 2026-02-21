"use server";

import { getProductById } from "@/services/productService";
import { computeUnitPriceCents } from "@/lib/pricing";
import { getProductImagePath } from "@/lib/images";
import type { SelectedOptions } from "@/types";

export async function getPriceAndImage(productId: string, selectedOptions: SelectedOptions) {
  const product = await getProductById(productId);
  if (!product) return { error: "Product not found" as const };
  try {
    const unitPriceCents = computeUnitPriceCents(product, selectedOptions);
    const imagePath = getProductImagePath(productId);
    return { unitPriceCents, imagePath, productName: product.title };
  } catch (e) {
    return { error: (e instanceof Error ? e.message : "Invalid options") as string };
  }
}
