/**
 * Product images: one base image per product, stored in public/products/{productId}/base.jpg
 */

import type { Product, SelectedOptions } from "@/types";

const PRODUCTS_BASE = "/products";

export function getProductImagePath(productId: string): string {
  return `${PRODUCTS_BASE}/${productId}/base.jpg`;
}

/** For options with imageSuffix (future variant images). */
export function getProductImagePathWithOptions(
  productId: string,
  _product: Pick<Product, "options">,
  _selectedOptions: SelectedOptions
): string {
  return getProductImagePath(productId);
}

export function getProductImagePaths(productId: string): string[] {
  return [getProductImagePath(productId)];
}
