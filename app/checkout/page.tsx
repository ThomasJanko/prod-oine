import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-wood-dark text-2xl mb-6">
        Finaliser la commande
      </h1>
      <CheckoutClient />
    </div>
  );
}
