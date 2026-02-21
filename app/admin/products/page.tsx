import Link from "next/link";
import { listProducts } from "@/services/productService";
import { ProductListActions } from "./ProductListActions";

export default async function AdminProductsPage() {
  const products = await listProducts(true);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-wood-dark text-2xl">Produits</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-wood-dark text-cream rounded text-sm font-medium hover:bg-wood"
        >
          Nouveau produit
        </Link>
      </div>
      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p._id}
            className={`flex items-center gap-4 py-3 px-3 rounded border border-metal-dark/10 ${p.active !== false ? "bg-stone" : "bg-stone/50 opacity-75"}`}
          >
            <Link href={`/admin/products/${p._id}`} className="font-medium text-wood-dark hover:underline flex-1 min-w-0">
              <span className="text-wood-light text-sm">{p.collectionName}</span>
              <span className="ml-2">{p.title}</span>
            </Link>
            <span className="text-wood-light text-sm">{(p.basePrice / 100).toFixed(2)} €</span>
            {p.active === false && (
              <span className="text-wood-light text-xs uppercase">Inactif</span>
            )}
            <ProductListActions productId={p._id} active={p.active !== false} />
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <p className="text-wood-light">Aucun produit. Créez-en un.</p>
      )}
    </div>
  );
}
