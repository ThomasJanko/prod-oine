import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/services/productService";
import { ProductForm } from "../ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-wood-light text-sm hover:underline">
          ← Produits
        </Link>
        <h1 className="font-display font-bold text-wood-dark text-2xl">
          Modifier : {product.title}
        </h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
