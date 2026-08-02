const Stripe = require('stripe');

// Source de vérité des prix — jamais fait confiance au montant envoyé par le client.
const PLANS = {
  simple:     { name: 'Flyer Simple',          amount: 1499 },
  rectoverso: { name: 'Flyer Recto/Verso',     amount: 2500 },
  premium:    { name: 'Flyer Premium',         amount: 2900 },
  social:     { name: 'Pack Réseaux Sociaux',  amount: 2000 },
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Paiement non configuré côté serveur' }) };
  }

  let plan;
  try {
    ({ plan } = JSON.parse(event.body || '{}'));
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  const selected = PLANS[plan];
  if (!selected) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Formule inconnue' }) };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = event.headers.origin || `https://${event.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `${selected.name} — Flyer Éclair` },
          unit_amount: selected.amount,
        },
        quantity: 1,
      }],
      success_url: `${origin}/merci.html?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/index.html#tarifs`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur lors de la création du paiement' }) };
  }
};
