import { listOrders } from "@/services/orderService";

export default async function AdminOrdersPage() {
  const orders = await listOrders(100);
  return (
    <div>
      <h1 className="font-display font-bold text-wood-dark text-2xl mb-6">
        Commandes
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-metal-dark/20 rounded overflow-hidden">
          <thead className="bg-wood-dark/10 text-wood-dark">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Articles</th>
            </tr>
          </thead>
          <tbody className="bg-stone text-wood-dark">
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-metal-dark/10">
                <td className="px-4 py-2">
                  {o.createdAt instanceof Date
                    ? o.createdAt.toISOString().slice(0, 16)
                    : new Date(o.createdAt).toISOString().slice(0, 16)}
                </td>
                <td className="px-4 py-2">{o.email}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2">{(o.totalCents / 100).toFixed(2)} €</td>
                <td className="px-4 py-2">
                  {o.items.map((i) => `${i.productName} × ${i.quantity}`).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <p className="text-wood-light mt-4">Aucune commande.</p>
      )}
    </div>
  );
}
