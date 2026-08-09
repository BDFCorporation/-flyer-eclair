import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";

export const metadata: Metadata = {
  title: "Nos parfums",
  description:
    "Découvrez Aisha, Bois Intense, Sauvage Intense et Bakara, 14,99 € TTC chacun.",
};

export const dynamic = "force-dynamic";

export default async function ParfumsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Nos parfums</h1>
      <ProductFilters defaultQuery={query} />
      {products.length === 0 ? (
        <p className="mt-10 text-ink/60">Aucun parfum ne correspond à « {query} ».</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
