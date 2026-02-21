"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct, saveProduct } from "@/app/actions/admin";
import { getProductImagePath } from "@/lib/images";
import { ProductCardPreview } from "@/components/ProductCardPreview";
import type { Product } from "@/types";

interface ProductFormProps {
  readonly product?: Product | null;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!product;

  const [collectionName, setCollectionName] = useState(product?.collectionName ?? "");
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    product ? (product.basePrice / 100).toFixed(2) : ""
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewImageUrl =
    imagePreview ?? (product ? getProductImagePath(product._id) : null);
  const previewPriceCents = Math.round(Number.parseFloat(basePrice || "0") * 100);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("collectionName", collectionName);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("basePrice", basePrice);
    const file = fileInputRef.current?.files?.[0];
    if (file) formData.set("baseImage", file);

    try {
      if (isEdit) {
        formData.set("productId", product._id);
        const result = await saveProduct(formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImagePreview(null);
        router.refresh();
      } else {
        const result = await createProduct(formData);
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.id) router.push(`/admin/products/${result.id}`);
        else router.push("/admin/products");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Preview: same as ProductCard (Collection, Title, Image, Price) */}
      <div className="w-full md:w-auto shrink-0">
        <p className="text-wood-light text-sm font-medium mb-2">Aperçu</p>
        <ProductCardPreview
          collectionName={collectionName}
          title={title}
          priceCents={previewPriceCents}
          imageUrl={previewImageUrl}
        />
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 flex-1">
        <div>
          <label htmlFor="collectionName" className="block text-wood-dark font-medium text-sm mb-1">
            Collection
          </label>
          <input
            id="collectionName"
            type="text"
            name="collectionName"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
            className="w-full border border-metal-dark/30 rounded px-3 py-2 bg-cream text-wood-dark"
            placeholder="Fonderie"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-wood-dark font-medium text-sm mb-1">
            Titre
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-metal-dark/30 rounded px-3 py-2 bg-cream text-wood-dark"
            placeholder="Console 01"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-wood-dark font-medium text-sm mb-1">
            Description (optionnel)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-metal-dark/30 rounded px-3 py-2 bg-cream text-wood-dark"
          />
        </div>
        <div>
          <label htmlFor="basePrice" className="block text-wood-dark font-medium text-sm mb-1">
            Prix (€)
          </label>
          <input
            id="basePrice"
            type="number"
            name="basePrice"
            step="0.01"
            min="0"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            className="w-full border border-metal-dark/30 rounded px-3 py-2 bg-cream text-wood-dark"
            placeholder="299.00"
          />
        </div>
        <div>
          <label htmlFor="baseImage" className="block text-wood-dark font-medium text-sm mb-1">
            {isEdit ? "Remplacer l'image" : "Image"}
          </label>
          <input
            ref={fileInputRef}
            id="baseImage"
            type="file"
            name="baseImage"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full border border-metal-dark/30 rounded px-3 py-2 bg-cream text-wood-dark file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-wood-dark file:text-cream file:text-sm"
          />
          <p className="text-wood-light text-xs mt-1">JPG, PNG ou WebP. L’aperçu se met à jour ci-dessus.</p>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-wood-dark text-cream rounded font-medium hover:bg-wood disabled:opacity-50"
          >
            {loading ? "..." : (isEdit ? "Enregistrer" : "Créer le produit")}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2 border border-metal-dark/30 rounded text-wood-dark hover:bg-stone"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
