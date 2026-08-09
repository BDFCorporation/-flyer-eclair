"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ProductStockForm({
  product,
}: {
  product: { id: string; stock: number; isActive: boolean };
}) {
  const router = useRouter();
  const [stock, setStock] = useState(product.stock);
  const [isActive, setIsActive] = useState(product.isActive);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock, isActive }),
    });
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <Input
        type="number"
        min={0}
        value={stock}
        onChange={(event) => setStock(Number(event.target.value))}
        className="w-20"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
        />
        Actif
      </label>
      <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "..." : "Enregistrer"}
      </Button>
    </div>
  );
}
