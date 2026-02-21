"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Votre panier est vide.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            selectedOptions: i.selectedOptions,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la création du paiement.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("Réponse invalide du serveur.");
    } catch (e) {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <p className="text-wood-light">
        Votre panier est vide.{" "}
        <a href="/" className="underline text-wood-dark">
          Voir les produits
        </a>
      </p>
    );
  }

  const totalCents = items.reduce(
    (sum, i) => sum + (i.unitPriceCents ?? 0) * i.quantity,
    0
  );
  const hasValidPrices = items.every((i) => i.unitPriceCents != null);

  return (
    <div className="max-w-md space-y-6">
      <ul className="space-y-2 text-wood-dark">
        {items.map((item) => (
          <li key={item.productId + JSON.stringify(item.selectedOptions)}>
            {item.productName} × {item.quantity}
            {item.unitPriceCents != null && (
              <span className="text-wood-light text-sm ml-2">
                {(item.unitPriceCents * item.quantity) / 100} €
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="font-medium text-wood-dark">
        Total : {hasValidPrices ? totalCents / 100 + " €" : "Recalculé à la commande"}
      </p>
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={handleCheckout}
        className="w-full py-3 bg-wood-dark text-cream font-medium rounded hover:bg-wood transition-colors disabled:opacity-50"
      >
        {loading ? "Redirection vers le paiement..." : "Payer avec Stripe"}
      </button>
    </div>
  );
}
