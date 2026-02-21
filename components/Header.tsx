"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const items = useCart((s) => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header
      className="relative text-cream bg-cover bg-center bg-no-repeat min-h-[300px] flex flex-col justify-end"
      style={{ backgroundImage: "url(/images/header.png)" }}
    >
      {/* Overlay so text stays readable on any image */}
      <div className="absolute inset-0 bg-wood-dark/75" aria-hidden />
      <div className="relative container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-display font-bold tracking-tight">
            Prod&apos;Oine
          </span>
          <span className="text-stone/80 text-sm hidden sm:inline">
            • Créateur de mobilier •
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-stone/90 hover:text-cream text-sm">
            Collections
          </Link>
          <button
            type="button"
            className="relative p-2 text-stone/90 hover:text-cream"
            aria-label="Panier"
            onClick={() => {
              const event = new CustomEvent("cart:open");
              window.dispatchEvent(event);
            }}
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-metal-muted text-cream text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
      <p className="relative container mx-auto px-4 pb-2 text-stone/80 text-sm">
        Mobilier industriel durable – Fabriqué en France
      </p>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
