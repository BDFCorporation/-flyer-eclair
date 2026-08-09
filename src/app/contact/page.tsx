"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-3xl mb-4">Message envoyé</h1>
        <p className="text-ink/60">Nous vous répondrons rapidement.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl mb-8">Contact</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input placeholder="Nom" required value={form.name} onChange={update("name")} />
        <Input
          type="email"
          placeholder="E-mail"
          required
          value={form.email}
          onChange={update("email")}
        />
        <textarea
          placeholder="Votre message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {status === "error" && (
          <p className="text-sm text-red-600">Une erreur est survenue, réessayez plus tard.</p>
        )}
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi..." : "Envoyer"}
        </Button>
      </form>
    </main>
  );
}
