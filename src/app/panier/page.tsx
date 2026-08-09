"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPriceCents } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function PanierPage() {
  const { items, subtotalCents, isLoading, fetchCart, setQuantity, removeItem } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isLoading && items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-3xl mb-4">Votre panier</h1>
        <p className="text-ink/60">
          Votre panier est vide.{" "}
          <Link href="/parfums" className="underline">
            Voir nos parfums
          </Link>
          .
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Votre panier</h1>
      <ul className="divide-y divide-ink/10">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-ink/60">
                {formatPriceCents(item.unitPriceCents)} l&apos;unité
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={item.quantity}
                onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                className="rounded-md border border-ink/15 px-2 py-1.5 text-sm"
                aria-label={`Quantité pour ${item.name}`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="w-16 text-right font-medium">
                {formatPriceCents(item.totalCents)}
              </span>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm text-ink/50 hover:text-ink"
                aria-label={`Retirer ${item.name}`}
              >
                Retirer
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
        <span className="text-ink/60">Sous-total</span>
        <span className="text-lg font-semibold">{formatPriceCents(subtotalCents)}</span>
      </div>
      <p className="mt-1 text-sm text-ink/50">Frais de livraison calculés à l&apos;étape suivante.</p>
      <Link href="/commande" className="mt-6 block">
        <Button className="w-full">Passer commande</Button>
      </Link>
    </main>
  );
}
