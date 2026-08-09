import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MesCommandesPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/compte");

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Mes commandes</h1>
      {orders.length === 0 ? (
        <p className="text-ink/60">Aucune commande pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {orders.map((order) => (
            <li key={order.id} className="rounded-lg border border-ink/10 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{order.orderNumber}</span>
                <span className="text-sm text-ink/60">{order.status}</span>
              </div>
              <ul className="mt-3 text-sm text-ink/70">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-semibold">{formatPriceCents(order.totalCents)}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
