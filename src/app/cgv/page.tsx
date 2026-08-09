import type { Metadata } from "next";
import { SITE_NAME, PRODUCT_PRICE_CENTS, formatPriceCents } from "@/lib/constants";

export const metadata: Metadata = { title: "Conditions générales de vente" };

const SECTIONS = [
  {
    title: "1. Objet",
    body: `Les présentes conditions générales de vente régissent les ventes de parfums (Aisha, Bois Intense, Sauvage Intense, Bakara) réalisées sur le site ${SITE_NAME} par [Raison sociale à compléter].`,
  },
  {
    title: "2. Prix",
    body: `Chaque parfum est vendu au prix unique de ${formatPriceCents(PRODUCT_PRICE_CENTS)} TTC. Les frais de livraison sont indiqués avant validation de la commande.`,
  },
  {
    title: "3. Commande et paiement",
    body: "Les commandes sont réglées en ligne par carte bancaire via Stripe. La commande est confirmée après validation du paiement.",
  },
  {
    title: "4. Livraison",
    body: "Les commandes sont expédiées par nos soins après validation du paiement. Les délais indicatifs sont communiqués sur la page de commande.",
  },
  {
    title: "5. Droit de rétractation",
    body: "Conformément à la réglementation européenne, le client dispose d'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation, sauf produit descellé pour des raisons d'hygiène.",
  },
  {
    title: "6. Service client",
    body: "Pour toute question, le client peut contacter le service client via la page contact.",
  },
];

export default function CgvPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Conditions générales de vente</h1>
      <p className="text-sm text-ink/50 mb-8">
        Modèle à faire relire par un professionnel du droit avant mise en ligne.
      </p>
      <div className="space-y-6 text-sm text-ink/80">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold text-ink mb-1">{section.title}</h2>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
