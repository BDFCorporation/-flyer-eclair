import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Source de vérité des prix — jamais fait confiance au montant envoyé par le client.
const PLANS: Record<string, { name: string; amount: number }> = {
  simple: { name: "Flyer Simple", amount: 1499 },
  rectoverso: { name: "Flyer Recto/Verso", amount: 2500 },
  premium: { name: "Flyer Premium", amount: 2900 },
  social: { name: "Pack Réseaux Sociaux", amount: 2000 },
};

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Paiement non configuré côté serveur" },
      { status: 500 }
    );
  }

  let plan: string | undefined;
  try {
    ({ plan } = await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const selected = plan ? PLANS[plan] : undefined;
  if (!selected) {
    return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
  }

  // Ne pas faire confiance à l'en-tête Origin (contrôlable par l'appelant) pour construire
  // les URLs de redirection Stripe : cela permettrait un open redirect vers un domaine tiers.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${selected.name} — Flyer Éclair` },
            unit_amount: selected.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/flyers/merci.html?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/flyers/index.html#tarifs`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
