import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone">
      <nav className="bg-wood-dark text-cream py-3 px-4 flex gap-6">
        <Link href="/admin" className="font-display font-bold">
          Admin Prod&apos;Oine
        </Link>
        <Link href="/admin/products" className="text-stone/90 hover:text-cream text-sm">
          Produits
        </Link>
        <Link href="/admin/orders" className="text-stone/90 hover:text-cream text-sm">
          Commandes
        </Link>
        <Link href="/" className="text-stone/90 hover:text-cream text-sm ml-auto">
          Site
        </Link>
      </nav>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
