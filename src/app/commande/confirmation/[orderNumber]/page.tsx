import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/constants";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "en attente de paiement",
  PAID: "payée",
  PROCESSING: "en préparation",
  SHIPPED: "expédiée",
  DELIVERED: "livrée",
  CANCELLED: "annulée",
  REFUNDED: "remboursée",
};

export default async function ConfirmationPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Merci pour votre commande</h1>
      <p className="text-ink/60 mb-8">
        Commande {order.orderNumber} — {STATUS_LABELS[order.status] ?? order.status}
      </p>
      <ul className="divide-y divide-ink/10 mb-6">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between py-3">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPriceCents(item.totalCents)}</span>
          </li>
        ))}
      </ul>
      <p className="font-semibold">Total : {formatPriceCents(order.totalCents)}</p>
    </main>
  );
}
