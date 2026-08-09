import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceCents, SITE_NAME } from "@/lib/constants";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/parfums/${product.slug}`,
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex aspect-square items-center justify-center rounded-lg bg-accent-tint">
        {product.images[0] ? (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            width={640}
            height={640}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span className="font-display text-3xl text-accent-strong">{product.name}</span>
        )}
      </div>
      <div>
        <h1 className="font-display text-3xl">{product.name}</h1>
        <p className="mt-2 text-lg font-semibold">{formatPriceCents(product.priceCents)}</p>
        <p className="mt-6 text-ink/70">{product.description}</p>
        <p className="mt-6 text-sm text-ink/50">
          {product.stock > 0 ? "En stock" : "Rupture de stock"}
        </p>
        {product.stock > 0 && <AddToCartButton productId={product.id} />}
      </div>
    </main>
  );
}
