import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="font-display font-bold text-wood-dark text-2xl mb-6">
        Nouveau produit
      </h1>
      <div className="w-full max-w-lg">
        <ProductForm />
      </div>
    </div>
  );
}
