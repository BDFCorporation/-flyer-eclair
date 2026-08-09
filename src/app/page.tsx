import Link from "next/link";

const ACTIVITIES = [
  {
    key: "audiovisuel",
    name: "BDF Production",
    tagline: "Location de matériel audiovisuel, photo, vidéo & direction artistique",
    description:
      "Location de matériel audiovisuel, prestations photo & vidéo, accompagnement création de contenus et direction artistique, pour créateurs, marques et entreprises.",
    href: "/bdf-production/index.html",
    cta: "Découvrir l'activité audiovisuel",
    accent: "#f5a623",
  },
  {
    key: "flyers",
    name: "Flyer Éclair",
    tagline: "Flyers professionnels sur-mesure, livrés en 24h",
    description:
      "Un designer expérimenté conçoit votre flyer sur-mesure, à un prix fixe et un délai que personne d'autre ne tient : 24 heures, chrono en main.",
    href: "/flyers/index.html",
    cta: "Commander un flyer",
    accent: "#7c3aed",
  },
  {
    key: "parfums",
    name: "Parfums",
    tagline: "4 fragrances signature, 14,99 € TTC chacune",
    description:
      "Aisha, Bois Intense, Sauvage Intense, Bakara — des parfums pensés pour durer, livrés directement chez vous.",
    href: "/parfums",
    cta: "Voir les parfums",
    accent: "#a8672c",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-ink/50 mb-3">BDF Production</p>
      <h1 className="font-display text-4xl sm:text-5xl mb-4 max-w-2xl">
        Un groupe, trois métiers au service de votre image et de vos projets.
      </h1>
      <p className="text-ink/60 max-w-2xl mb-14">
        Matériel audiovisuel et prestations photo/vidéo, flyers professionnels sur-mesure, et une
        gamme de parfums signature — trois activités réunies sous un même toit.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {ACTIVITIES.map((activity) => (
          <li
            key={activity.key}
            className="flex flex-col border border-ink/10 rounded-xl p-6 hover:border-ink/30 transition-colors"
          >
            <span
              className="inline-block w-8 h-1.5 rounded-full mb-5"
              style={{ background: activity.accent }}
            />
            <h2 className="font-display text-xl mb-2">{activity.name}</h2>
            <p className="text-sm font-medium text-ink/70 mb-3">{activity.tagline}</p>
            <p className="text-sm text-ink/60 mb-6 flex-1">{activity.description}</p>
            <Link
              href={activity.href}
              className="text-sm font-semibold text-ink hover:underline"
            >
              {activity.cta} →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
