/**
 * Source unique des 4 parfums du catalogue. Ne pas modifier les noms ni les
 * ajouter/retirer sans consigne explicite : ils sont utilisés tels quels dans
 * la base de données, les pages produit, le panier, les commandes, les
 * e-mails, l'admin et le SEO.
 */
export const PRODUCTS = [
  {
    name: "Aisha",
    slug: "aisha",
    shortDescription: "Un sillage floral et ambré, signature et enveloppant.",
    description:
      "Aisha ouvre sur des notes florales lumineuses avant de se poser sur un fond ambré chaleureux. Une fragrance signature, pensée pour durer toute la journée.",
  },
  {
    name: "Bois Intense",
    slug: "bois-intense",
    shortDescription: "Un boisé profond, chaud et affirmé.",
    description:
      "Bois Intense assume un cœur boisé dense, porté par des accords chauds et une pointe d'épices. Une fragrance de caractère pour une présence marquée.",
  },
  {
    name: "Sauvage Intense",
    slug: "sauvage-intense",
    shortDescription: "Un sillage frais et intense, taillé pour l'affirmation.",
    description:
      "Sauvage Intense associe fraîcheur immédiate et fond intense pour un sillage qui s'impose sans jamais saturer. Une fragrance pensée pour durer.",
  },
  {
    name: "Bakara",
    slug: "bakara",
    shortDescription: "Un parfum ambré et épicé, à la tenue longue durée.",
    description:
      "Bakara déploie des accords ambrés et épicés sur un fond riche et persistant. Une fragrance dense, pour une tenue longue durée.",
  },
] as const;

export type ProductSlug = (typeof PRODUCTS)[number]["slug"];

/** Prix unique TTC de chaque parfum, en centimes (14,99 €). */
export const PRODUCT_PRICE_CENTS = 1499;

export const CURRENCY = "EUR";

export const SITE_NAME = "BDF Production";

export function formatPriceCents(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: CURRENCY,
  });
}
