"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AuthForms() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      setIsSubmitting(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="max-w-sm">
      <div className="mb-6 flex gap-4 text-sm">
        <button
          type="button"
          className={mode === "login" ? "font-semibold" : "text-ink/50"}
          onClick={() => setMode("login")}
        >
          Connexion
        </button>
        <button
          type="button"
          className={mode === "register" ? "font-semibold" : "text-ink/50"}
          onClick={() => setMode("register")}
        >
          Créer un compte
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "register" && (
          <Input
            placeholder="Nom"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        )}
        <Input
          type="email"
          placeholder="E-mail"
          required
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          required
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </Button>
      </form>
    </div>
  );
}
