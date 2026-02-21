"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cart:open", handler);
    return () => window.removeEventListener("cart:open", handler);
  }, []);

  const totalCents = items.reduce(
    (sum, i) => sum + (i.unitPriceCents ?? 0) * i.quantity,
    0
  );
  const hasValidPrices = items.every((i) => i.unitPriceCents != null);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-wood-dark/50 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed top-0 right-0 z-50 w-full max-w-md h-full bg-stone shadow-xl flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 border-b border-metal-dark/20 flex items-center justify-between">
          <h2 className="font-display font-bold text-wood-dark text-lg">
            Panier
          </h2>
          <button
            type="button"
            className="p-2 text-wood-dark hover:bg-wood-dark/10 rounded"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-wood-light text-sm">Votre panier est vide.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId + JSON.stringify(item.selectedOptions)}
                  className="flex gap-3 border-b border-metal-dark/10 pb-4"
                >
                  <div className="w-20 h-20 bg-wood-dark/10 rounded overflow-hidden flex-shrink-0 relative">
                    {item.imagePath ? (
                      <Image
                        src={item.imagePath}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-metal-muted text-xs">
                        —
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-wood-dark truncate">
                      {item.productName}
                    </p>
                    <p className="text-wood-light text-xs">
                      {Object.entries(item.selectedOptions)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(", ")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            item.selectedOptions,
                            Number(e.target.value)
                          )
                        }
                        className="w-12 text-sm border border-metal-dark/30 rounded bg-cream px-1 py-0.5"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <span className="text-wood-dark text-sm">
                        {item.unitPriceCents != null
                          ? (item.unitPriceCents * item.quantity) / 100 + " €"
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-metal-muted hover:text-wood-dark text-sm"
                    onClick={() =>
                      removeItem(item.productId, item.selectedOptions)
                    }
                    aria-label="Retirer"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-metal-dark/20 space-y-3">
          <div className="flex justify-between text-wood-dark font-medium">
            <span>Total</span>
            <span>
              {hasValidPrices ? totalCents / 100 + " €" : "Recalculé à la commande"}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full py-3 bg-wood-dark text-cream text-center font-medium rounded hover:bg-wood transition-colors"
            onClick={() => setOpen(false)}
          >
            Commander
          </Link>
        </div>
      </aside>
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
