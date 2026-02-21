"use client";

import type { Product, SelectedOptions } from "@/types";

interface ProductOptionSelectorsProps {
  product: Product;
  selectedOptions: SelectedOptions;
  onChange: (selected: SelectedOptions) => void;
}

export function ProductOptionSelectors({
  product,
  selectedOptions,
  onChange,
}: ProductOptionSelectorsProps) {
  return (
    <div className="space-y-4">
      {product.options.map((option) => (
        <div key={option.key}>
          <label className="block text-wood-dark font-medium text-sm mb-2">
            {option.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.choices.map((choice) => {
              const isSelected = selectedOptions[option.key] === choice.value;
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...selectedOptions,
                      [option.key]: choice.value,
                    })
                  }
                  className={`px-3 py-2 rounded border text-sm transition-colors ${
                    isSelected
                      ? "border-wood-dark bg-wood-dark text-cream"
                      : "border-metal-dark/30 bg-stone text-wood-dark hover:border-wood-light"
                  }`}
                >
                  {choice.label}
                  {choice.priceModifier !== 0 && (
                    <span className="ml-1 opacity-80">
                      {choice.priceModifier > 0 ? "+" : ""}
                      {choice.priceModifier / 100} €
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
