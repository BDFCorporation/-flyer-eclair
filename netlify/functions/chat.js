const SYSTEM_PROMPT = "Tu es l'assistant virtuel de Flyer Éclair, un service de création de flyers professionnels sur-mesure en France. Réponds toujours en français, de façon brève, chaleureuse et utile (3-4 phrases maximum). Informations clés à utiliser : tarifs fixes (Flyer Simple 14,99€, Flyer Recto/Verso 25€, Flyer Premium 29€, Pack Réseaux Sociaux 20€, option Livraison Express +10€ pour une livraison en moins de 12h) ; livraison garantie sous 24h ; une retouche incluse (deux pour la formule Premium) ; fichiers livrés en PDF et JPG haute définition ; paiement par carte bancaire via Stripe au moment de la commande, puis envoi du contenu (texte, logo, visuels) via le formulaire du site. Encourage systématiquement à utiliser le formulaire ou les boutons de commande du site pour passer commande. Si une question sort du cadre du service (sujet hors sujet, demande technique complexe), invite poliment à contacter contact@bdfproduction.fr.";

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Méthode non autorisée' }) };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Assistant non configuré côté serveur' }) };
  }

  let messages;
  try {
    ({ messages } = JSON.parse(event.body || '{}'));
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Requête invalide' }) };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Aucun message fourni' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await response.json();
    return { statusCode: response.status, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: 'Assistant indisponible' }) };
  }
};
