import { notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import { ProductConfigClient } from "./ProductConfigClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const defaultOptions: Record<string, string> = {};
  for (const opt of product.options) {
    const def = product.defaultOptions?.[opt.key];
    defaultOptions[opt.key] = def ?? opt.choices[0]?.value ?? "";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductConfigClient
        product={product}
        defaultSelectedOptions={defaultOptions}
      />
    </div>
  );
}
