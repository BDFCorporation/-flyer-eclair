import { prisma } from "@/lib/prisma";
import { formatPriceCents } from "@/lib/constants";
import { ProductStockForm } from "@/components/admin/ProductStockForm";

export const dynamic = "force-dynamic";

export default async function AdminProduitsPage() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Produits</h1>
      <ul className="flex flex-col gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between rounded-lg border border-ink/10 p-4"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-ink/60">{formatPriceCents(product.priceCents)}</p>
            </div>
            <ProductStockForm product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
