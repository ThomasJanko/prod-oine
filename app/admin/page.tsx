import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display font-bold text-wood-dark text-2xl mb-6">
        Administration
      </h1>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/products" className="text-wood-dark underline hover:no-underline">
            Gérer les produits
          </Link>
          — Créer, modifier prix, options.
        </li>
        <li>
          <Link href="/admin/orders" className="text-wood-dark underline hover:no-underline">
            Voir les commandes
          </Link>
          — Liste des commandes payées.
        </li>
      </ul>
    </div>
  );
}
