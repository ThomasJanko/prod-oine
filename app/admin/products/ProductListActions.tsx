"use client";

import { useRouter } from "next/navigation";
import { deleteProduct, setProductActive } from "@/app/actions/admin";

interface ProductListActionsProps {
  productId: string;
  active: boolean;
}

export function ProductListActions({ productId, active }: ProductListActionsProps) {
  const router = useRouter();

  const handleToggleActive = async () => {
    const result = await setProductActive(productId, !active);
    if (!result.error) router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce produit ?")) return;
    const result = await deleteProduct(productId);
    if (!result.error) router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleActive}
        className="text-sm px-2 py-1 rounded border border-metal-dark/30 hover:bg-stone text-wood-dark"
      >
        {active ? "Désactiver" : "Activer"}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="text-sm px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
      >
        Supprimer
      </button>
    </div>
  );
}
