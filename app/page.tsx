import Link from "next/link";
import { listProducts } from "@/services/productService";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const products = await listProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="rule-line" />
        <span className="text-metal-muted text-sm uppercase tracking-widest">
          Collection
        </span>
        <span className="rule-line" />
      </div>
      <h1 className="font-display font-bold text-wood-dark text-3xl mb-8 text-center w-full uppercase">
        Fonderie
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <li key={product._id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {products.length === 0 && (
        <p className="text-wood-light">
          Aucun produit pour le moment.{" "}
          <Link href="/admin/products" className="underline">
            Créer un produit
          </Link>
        </p>
      )}
    </div>
  );
}
