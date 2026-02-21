"use client";

import { useState } from "react";

/** Same look as ProductCard but for admin preview: Collection, Title, Image, Price. No link. */
interface ProductCardPreviewProps {
  collectionName: string;
  title: string;
  priceCents: number;
  /** Image URL (object URL or /products/id/base.jpg). If null, shows placeholder. */
  imageUrl: string | null;
}

export function ProductCardPreview({
  collectionName,
  title,
  priceCents,
  imageUrl,
}: ProductCardPreviewProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  return (
    <div className="block bg-stone rounded overflow-hidden border border-metal-dark/10 max-w-xs">
      <div className="aspect-[4/3] relative bg-wood-dark/10">
        {showImage ? (
          <img
            src={imageUrl}
            alt={title || "Aperçu"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wood-light/50 text-sm">
            {imageUrl ? "Pas d&apos;image" : "Choisir une image"}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-wood-light text-xs uppercase tracking-wide">
          {collectionName || "—"}
        </p>
        <p className="font-display font-bold text-wood-dark text-center">
          {title || "—"}
        </p>
        <p className="text-wood-light text-sm mt-1 text-center">
          à partir de {(priceCents / 100).toFixed(2)} €
        </p>
      </div>
    </div>
  );
}
