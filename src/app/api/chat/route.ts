import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});
const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

const SYSTEM_PROMPT =
  "Tu es l'assistant virtuel de BDF Production, un groupe français réunissant trois activités : " +
  "1) Flyer Éclair — création de flyers professionnels sur-mesure (tarifs fixes : Flyer Simple 14,99€, " +
  "Flyer Recto/Verso 25€, Flyer Premium 29€, Pack Réseaux Sociaux 20€, option Livraison Express +10€ pour moins de 12h ; " +
  "livraison garantie sous 24h ; une retouche incluse (deux pour la formule Premium) ; fichiers livrés en PDF et JPG HD ; " +
  "paiement par carte via Stripe) ; " +
  "2) Parfums — boutique en ligne de 4 fragrances (Aisha, Bois Intense, Sauvage Intense, Bakara) à 14,99€ TTC chacune ; " +
  "3) BDF Production — location de matériel audiovisuel, prestations photo & vidéo, accompagnement création de contenus " +
  "et direction artistique, pour créateurs, marques et entreprises. " +
  "Réponds toujours en français, de façon brève, chaleureuse et utile (3-4 phrases maximum). Identifie si besoin à quelle " +
  "activité la question se rapporte et oriente vers la bonne page du site. Encourage à utiliser les formulaires ou boutons " +
  "de commande/devis du site. Si une question sort du cadre (sujet hors sujet, demande technique complexe), invite " +
  "poliment à contacter contact@bdfproduction.fr.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Assistant non configuré côté serveur" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const { messages } = parsed.data;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Assistant indisponible" }, { status: 502 });
  }
}
