"use client";

import { useEffect, useState, useTransition } from "react";
import { ProductOptionSelectors } from "@/components/ProductOptionSelectors";
import { useCart } from "@/hooks/useCart";
import { getPriceAndImage } from "@/app/actions/cart";
import { getProductImagePath } from "@/lib/images";
import type { Product, SelectedOptions } from "@/types";

interface ProductConfigClientProps {
  readonly product: Product;
  defaultSelectedOptions: SelectedOptions;
}

export function ProductConfigClient({
  product,
  defaultSelectedOptions,
}: ProductConfigClientProps) {
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOptions>(defaultSelectedOptions);
  const [priceCents, setPriceCents] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const addItem = useCart((s) => s.addItem);

  const imagePath = getProductImagePath(product._id);

  useEffect(() => {
    let cancelled = false;
    getPriceAndImage(product._id, defaultSelectedOptions).then((result) => {
      if (cancelled || "error" in result) return;
      setPriceCents(result.unitPriceCents);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id]);

  const handleOptionsChange = (next: SelectedOptions) => {
    setSelectedOptions(next);
    startTransition(async () => {
      const result = await getPriceAndImage(product._id, next);
      if ("error" in result) return;
      setPriceCents(result.unitPriceCents);
    });
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await getPriceAndImage(product._id, selectedOptions);
      if ("error" in result) return;
      addItem({
        productId: product._id,
        productName: result.productName,
        selectedOptions,
        quantity: 1,
        unitPriceCents: result.unitPriceCents,
        imagePath: result.imagePath,
      });
      const event = new CustomEvent("cart:open");
      window.dispatchEvent(event);
    });
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="aspect-square relative bg-stone rounded overflow-hidden border border-metal-dark/10 bg-wood-dark/10">
        {!imageError ? (
          <img
            src={imagePath}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wood-light/50 text-sm">
            Pas d&apos;image
          </div>
        )}
      </div>
      <div>
        <p className="text-wood-light text-sm uppercase tracking-wide">{product.collectionName}</p>
        <h1 className="font-display font-bold text-wood-dark text-2xl mb-2">
          {product.title}
        </h1>
        {product.description && (
          <p className="text-wood-light text-sm mb-6">{product.description}</p>
        )}
        {product.options.length > 0 && (
          <ProductOptionSelectors
            product={product}
            selectedOptions={selectedOptions}
            onChange={handleOptionsChange}
          />
        )}
        <div className="mt-8 flex items-center gap-6">
          <p className="text-wood-dark font-bold text-xl">
            {priceCents != null
              ? (priceCents / 100).toFixed(2) + " €"
              : (product.basePrice / 100).toFixed(2) + " €"}
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={handleAddToCart}
            className="px-6 py-3 bg-wood-dark text-cream font-medium rounded hover:bg-wood transition-colors disabled:opacity-50"
          >
            {isPending ? "..." : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </div>
  );
}
