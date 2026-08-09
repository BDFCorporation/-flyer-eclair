import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await prisma.product.findMany({ where: { isActive: true } });

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/parfums`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    { url: `${siteUrl}/cgv`, lastModified: new Date() },
    { url: `${siteUrl}/mentions-legales`, lastModified: new Date() },
    { url: `${siteUrl}/politique-confidentialite`, lastModified: new Date() },
    ...products.map((product) => ({
      url: `${siteUrl}/parfums/${product.slug}`,
      lastModified: product.updatedAt,
    })),
  ];
}
