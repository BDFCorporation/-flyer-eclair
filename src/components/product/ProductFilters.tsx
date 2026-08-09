"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ProductFilters({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/parfums${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-2">
      <Input
        type="search"
        placeholder="Rechercher un parfum..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Rechercher un parfum"
      />
      <Button type="submit" variant="secondary">
        Chercher
      </Button>
    </form>
  );
}
