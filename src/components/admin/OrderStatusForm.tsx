"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export function OrderStatusForm({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(newStatus: string) {
    setValue(newStatus);
    setIsSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setIsSaving(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      disabled={isSaving}
      className="rounded-md border border-ink/15 px-2 py-1.5 text-sm"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
