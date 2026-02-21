"use client";

import Link from "next/link";
import { useState } from "react";
import { getProductImagePath } from "@/lib/images";
import type { Product } from "@/types";

interface ProductCardProps {
  readonly product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imagePath = getProductImagePath(product._id);
  const productUrl = `/product/${product._id}`;

  return (
    <Link
      href={productUrl}
      className="block bg-stone rounded overflow-hidden border border-metal-dark/10 hover:border-wood-light/30 transition-colors"
    >
      <div className="aspect-[4/3] relative bg-wood-dark/10">
        {!imgError ? (
          <img
            src={imagePath}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-wood-light/50 text-sm"
            aria-hidden
          >
            Pas d&apos;image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-wood-light text-xs uppercase tracking-wide text-center">{product.collectionName}</p>
        <p className="font-display font-bold text-wood-dark text-center">{product.title}</p>
        <p className="text-wood-light text-sm mt-1 text-center">
          à partir de {(product.basePrice / 100).toFixed(2)} €
        </p>
      </div>
    </Link>
  );
}
