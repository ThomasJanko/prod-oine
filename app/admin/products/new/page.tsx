import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="w-full">
      <h1 className="font-display font-bold text-wood-dark text-2xl mb-6">
        Nouveau produit
      </h1>
      <ProductForm />
    </div>
  );
}
