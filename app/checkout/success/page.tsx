"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    if (sessionId) clear();
  }, [sessionId, clear]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="font-display font-bold text-wood-dark text-3xl mb-4">
        Merci pour votre commande
      </h1>
      <p className="text-wood-light mb-8">
        Votre paiement a bien été enregistré. Vous recevrez un email de confirmation.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-wood-dark text-cream font-medium rounded hover:bg-wood transition-colors"
      >
        Retour aux collections
      </Link>
    </div>
  );
}
