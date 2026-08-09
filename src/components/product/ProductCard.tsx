import Link from "next/link";
import Image from "next/image";
import type { Product, ProductImage } from "@prisma/client";
import { formatPriceCents } from "@/lib/constants";

type ProductWithImages = Product & { images: ProductImage[] };

export function ProductCard({ product }: { product: ProductWithImages }) {
  const image = product.images[0];

  return (
    <Link
      href={`/parfums/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-ink/10 transition-shadow hover:shadow-md"
    >
      <div className="flex aspect-square items-center justify-center bg-accent-tint">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            width={480}
            height={480}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-2xl text-accent-strong">{product.name}</span>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-display text-lg">{product.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{product.shortDescription}</p>
        <p className="mt-3 font-semibold">{formatPriceCents(product.priceCents)}</p>
      </div>
    </Link>
  );
}
