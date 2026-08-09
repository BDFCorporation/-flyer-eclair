"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export function CartIndicator() {
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/panier" className="rounded-md bg-ink px-3 py-1.5 text-paper hover:bg-ink/90">
      Panier{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
