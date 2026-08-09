import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl mb-6">Mentions légales</h1>
      <p className="text-sm text-ink/50 mb-8">
        Modèle à compléter avec les informations légales réelles de l&apos;entreprise avant mise
        en ligne.
      </p>
      <div className="space-y-6 text-sm text-ink/80">
        <div>
          <h2 className="font-semibold text-ink mb-1">Éditeur du site</h2>
          <p>
            {SITE_NAME} — [Raison sociale à compléter], [forme juridique], au capital de
            [montant] €.
            <br />
            Siège social : [adresse à compléter].
            <br />
            SIRET : [numéro à compléter] — RCS [ville à compléter].
            <br />
            Directeur de la publication : [nom à compléter].
            <br />
            Contact :{" "}
            <a href="/contact" className="underline">
              page contact
            </a>
            .
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-ink mb-1">Hébergement</h2>
          <p>[Nom de l&apos;hébergeur, adresse, contact à compléter].</p>
        </div>
        <div>
          <h2 className="font-semibold text-ink mb-1">Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus de ce site (textes, visuels, noms des parfums Aisha,
            Bois Intense, Sauvage Intense, Bakara) est protégé et ne peut être reproduit sans
            autorisation.
          </p>
        </div>
      </div>
    </main>
  );
}
