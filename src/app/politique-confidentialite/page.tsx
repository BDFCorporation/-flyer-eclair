import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Politique de confidentialité</h1>
      <p className="text-sm text-ink/50 mb-8">
        Modèle à compléter avec les informations réelles avant mise en ligne (RGPD).
      </p>
      <div className="space-y-6 text-sm text-ink/80">
        <div>
          <h2 className="font-semibold text-ink mb-1">Données collectées</h2>
          <p>
            {SITE_NAME} collecte les données nécessaires au traitement des commandes : e-mail,
            nom, adresse de livraison, historique de commandes.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-ink mb-1">Utilisation des données</h2>
          <p>
            Les données sont utilisées uniquement pour le traitement et le suivi des commandes,
            et ne sont jamais revendues à des tiers.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-ink mb-1">Droits des utilisateurs</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et
            de suppression de vos données, exerçable via la page contact.
          </p>
        </div>
      </div>
    </main>
  );
}
