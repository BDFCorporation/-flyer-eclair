"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";

export function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const setCartQuantity = useCartStore((state) => state.setQuantity);

  async function handleAdd() {
    setStatus("adding");
    setError(null);
    try {
      // /api/cart POST remplace la quantité (il ne l'incrémente pas) : on doit donc repartir
      // de l'état serveur à jour, pas du store local qui peut être périmé si la requête
      // initiale (CartIndicator) n'a pas encore résolu.
      await fetchCart();
      const current =
        useCartStore.getState().items.find((item) => item.productId === productId)?.quantity ?? 0;
      await setCartQuantity(productId, current + quantity);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  const maxSelectable = Math.min(5, stock);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <select
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="rounded-md border border-ink/15 px-2 py-2.5 text-sm"
          aria-label="Quantité"
        >
          {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <Button onClick={handleAdd} disabled={status === "adding"}>
          {status === "added" ? "Ajouté" : "Ajouter au panier"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
