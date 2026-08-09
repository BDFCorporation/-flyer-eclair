import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Une commande payée reste "payée" même une fois expédiée/livrée : on l'inclut dans les
// statistiques tant qu'elle a été honorée (donc tous les statuts après PAID, en excluant
// les commandes jamais payées ou annulées/remboursées).
const FULFILLED_STATUSES: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function AdminDashboardPage() {
  const [orderCount, revenue, lowStock] = await Promise.all([
    prisma.order.count({ where: { status: { in: FULFILLED_STATUSES } } }),
    prisma.order.aggregate({
      where: { status: { in: FULFILLED_STATUSES } },
      _sum: { totalCents: true },
    }),
    prisma.product.findMany({ where: { stock: { lt: 10 }, isActive: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-ink/10 p-5">
          <p className="text-sm text-ink/60">Commandes payées</p>
          <p className="mt-1 text-2xl font-semibold">{orderCount}</p>
        </div>
        <div className="rounded-lg border border-ink/10 p-5">
          <p className="text-sm text-ink/60">Chiffre d&apos;affaires</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatPriceCents(revenue._sum.totalCents ?? 0)}
          </p>
        </div>
      </div>
      {lowStock.length > 0 && (
        <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-5">
          <p className="font-medium text-amber-800">Stock faible</p>
          <ul className="mt-2 text-sm text-amber-800">
            {lowStock.map((product) => (
              <li key={product.id}>
                {product.name} — {product.stock} restant(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
