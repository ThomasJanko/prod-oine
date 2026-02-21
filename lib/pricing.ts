/**
 * Server-side pricing. Never trust client-submitted prices.
 * Validates selected options against product and returns total unit price in cents.
 * Used by cart validation, checkout session creation, and webhook order creation.
 */

import type { Product, ProductOption, SelectedOptions } from "@/types";

/**
 * Validates that every option key has a valid choice and returns the matching choice.
 * Throws if any option is missing or invalid.
 */
function getValidatedChoices(
  product: Product,
  selected: SelectedOptions
): { option: ProductOption; choice: ProductOption["choices"][number] }[] {
  const result: { option: ProductOption; choice: ProductOption["choices"][number] }[] = [];
  for (const option of product.options) {
    const value = selected[option.key];
    if (value == null) throw new Error(`Missing option: ${option.key}`);
    const choice = option.choices.find((c) => c.value === value);
    if (!choice) throw new Error(`Invalid choice "${value}" for option ${option.key}`);
    result.push({ option, choice });
  }
  return result;
}

/**
 * Computes unit price in cents for a product with given selected options.
 * If product has no options, returns basePrice. Otherwise validates and adds modifiers.
 */
export function computeUnitPriceCents(
  product: Product,
  selectedOptions: SelectedOptions
): number {
  if (!product.options?.length) return product.basePrice;
  const validated = getValidatedChoices(product, selectedOptions);
  let total = product.basePrice;
  for (const { choice } of validated) {
    total += choice.priceModifier;
  }
  if (total < 0) throw new Error("Computed price cannot be negative");
  return total;
}

/**
 * Same as computeUnitPriceCents but returns also the validated choices
 * (e.g. for building image path or 3D material keys later).
 */
export function computePriceAndChoices(
  product: Product,
  selectedOptions: SelectedOptions
): { unitPriceCents: number; choices: { optionKey: string; value: string; imageSuffix?: string }[] } {
  const validated = getValidatedChoices(product, selectedOptions);
  let unitPriceCents = product.basePrice;
  const choices: { optionKey: string; value: string; imageSuffix?: string }[] = [];
  for (const { option, choice } of validated) {
    unitPriceCents += choice.priceModifier;
    choices.push({
      optionKey: option.key,
      value: choice.value,
      imageSuffix: choice.imageSuffix,
    });
  }
  if (unitPriceCents < 0) throw new Error("Computed price cannot be negative");
  return { unitPriceCents, choices };
}
