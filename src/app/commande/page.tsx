"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const INITIAL_FORM = {
  email: "",
  fullName: "",
  line1: "",
  line2: "",
  postalCode: "",
  city: "",
  country: "FR",
  phone: "",
};

export default function CommandePage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        shippingAddress: {
          fullName: form.fullName,
          line1: form.line1,
          line2: form.line2 || undefined,
          postalCode: form.postalCode,
          city: form.city,
          country: form.country,
          phone: form.phone || undefined,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Finaliser la commande</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="E-mail"
          required
          value={form.email}
          onChange={update("email")}
        />
        <Input placeholder="Nom complet" required value={form.fullName} onChange={update("fullName")} />
        <Input placeholder="Adresse" required value={form.line1} onChange={update("line1")} />
        <Input
          placeholder="Complément d'adresse (optionnel)"
          value={form.line2}
          onChange={update("line2")}
        />
        <div className="flex gap-4">
          <Input placeholder="Code postal" required value={form.postalCode} onChange={update("postalCode")} />
          <Input placeholder="Ville" required value={form.city} onChange={update("city")} />
        </div>
        <Input placeholder="Téléphone (optionnel)" value={form.phone} onChange={update("phone")} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Redirection vers le paiement..." : "Payer avec Stripe"}
        </Button>
      </form>
    </main>
  );
}
