"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";

export function AddToCartButton({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const items = useCartStore((state) => state.items);
  const setCartQuantity = useCartStore((state) => state.setQuantity);

  async function handleAdd() {
    setStatus("adding");
    const current = items.find((item) => item.productId === productId)?.quantity ?? 0;
    await setCartQuantity(productId, current + quantity);
    setStatus("added");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div className="mt-8 flex items-center gap-3">
      <select
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
        className="rounded-md border border-ink/15 px-2 py-2.5 text-sm"
        aria-label="Quantité"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <Button onClick={handleAdd} disabled={status === "adding"}>
        {status === "added" ? "Ajouté" : "Ajouter au panier"}
      </Button>
    </div>
  );
}
