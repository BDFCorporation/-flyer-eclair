# BDF Production — site unifié

Site unique réunissant les trois activités du groupe :

- **BDF Production** (`/bdf-production/index.html`) — location de matériel audiovisuel, photo, vidéo, direction artistique. Page statique.
- **Flyer Éclair** (`/flyers/index.html`) — flyers professionnels sur-mesure, paiement Stripe, assistant IA. Page statique.
- **Parfums** (`/parfums`) — boutique à 4 références fixes : **Aisha**, **Bois Intense**, **Sauvage Intense**, **Bakara**, 14,99 € TTC chacune. Application Next.js complète (panier, comptes, Stripe, admin).

La page d'accueil (`/`) sert de hub et renvoie vers les trois activités. Une barre de navigation commune est injectée en haut des pages statiques, et un chatbot IA (assistant unique pour les 3 activités) est présent sur tout le site.

## Stack

Next.js 14 (App Router) · TypeScript · PostgreSQL · Prisma · Stripe · Tailwind CSS · HTML/CSS/JS statique (Flyer Éclair, BDF Production) · Anthropic API (chatbot)

## Démarrage

```bash
npm install
cp .env.example .env
# renseigner DATABASE_URL, STRIPE_*, RESEND_API_KEY, ANTHROPIC_API_KEY dans .env
npm run db:migrate
npm run db:seed
npm run dev
```

Le seed (`prisma/seed.ts`) insère les 4 parfums à partir de `src/lib/constants.ts`, qui est la **source unique** de leurs noms — toute autre partie du code (pages, panier, commandes, e-mails, admin, SEO) doit référencer cette constante plutôt que retaper les noms.

## Structure des pages statiques

`public/flyers/` et `public/bdf-production/` contiennent les sites d'origine tels quels (HTML/CSS/JS), servis directement par Next.js depuis le dossier `public/`. Les scripts `scripts/inject-hub-nav.js` et `scripts/inject-chatbot.js` ont servi une fois à ajouter la barre de navigation commune et le widget de chat à ces pages — ils ne doivent pas être ré-exécutés sans adapter leur garde anti-doublon si le contenu source change.

## Paiements

- Parfums : `/api/checkout` (Stripe Checkout, existant).
- Flyer Éclair : `/api/flyers-checkout` (porté depuis l'ancienne fonction Netlify `create-checkout-session.js`).

## Chatbot

`/api/chat` proxy vers l'API Anthropic (modèle `claude-sonnet-4-6`), avec un prompt système couvrant les 3 activités. Nécessite `ANTHROPIC_API_KEY` dans `.env`. Utilisé par le widget React (`src/components/chat/ChatWidget.tsx`, injecté globalement via `src/app/layout.tsx`) et par le widget JS injecté dans les pages statiques.
