import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/constants";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Commandes</h1>
      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-lg border border-ink/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-ink/60">{order.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatPriceCents(order.totalCents)}</span>
                <OrderStatusForm orderId={order.id} status={order.status} />
              </div>
            </div>
            <ul className="mt-3 text-sm text-ink/70">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.productName} × {item.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
