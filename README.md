# Ludothèque 🎲

Application web progressive (PWA) pour consulter et enrichir une ludothèque de jeux de société,
**sans compte utilisateur**. Déployée sur GitHub Pages, elle lit et écrit ses données dans une
Google Sheet via un Web App Google Apps Script, et protège les écritures avec Cloudflare Turnstile.

[![CI](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml)
[![Déploiement](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml)

> **État du projet : cadrage.**
> Le socle technique est prêt (build, qualité, CI/CD, PWA, serveur local). L'interface sera
> développée à partir des wireframes et de la maquette à venir. Voir la
> [roadmap](docs/roadmap.md).

## Principes

| Principe                | Règle                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| **100 % gratuit**       | GitHub Pages, Google Sheets, Apps Script, Cloudflare Turnstile, open source |
| **Sans compte**         | Lecture et ajout publics, aucune authentification                           |
| **PC + mobile**         | Chaque écran est conçu et testé sur les deux formats                        |
| **PWA dans Réglages**   | Installation proposée dans le menu, jamais en bannière automatique          |
| **Maquette = vérité**   | Aucune invention visuelle ; tout écart doit être validé                     |
| **Demander avant**      | Aucune décision structurante sans accord (voir [AGENTS.md](AGENTS.md))      |
| **Données dans Sheets** | Jamais de clé Google côté navigateur                                        |
| **Turnstile**           | Toute écriture est vérifiée côté serveur                                    |
| **Légal**               | Mentions légales et confidentialité accessibles depuis l'application        |

## Stack

| Domaine     | Choix                                                                  | Coût |
| ----------- | ---------------------------------------------------------------------- | ---- |
| Build       | [Vite](https://vite.dev/) 8                                            | 0 €  |
| UI          | [React](https://react.dev/) 19 + TypeScript strict                     | 0 €  |
| Styles      | CSS natif + design tokens issus de la maquette                         | 0 €  |
| PWA         | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox)         | 0 €  |
| Backend     | Google Apps Script (Web App)                                           | 0 €  |
| Données     | Google Sheets                                                          | 0 €  |
| Anti-bot    | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) | 0 €  |
| Tests       | [Vitest](https://vitest.dev/) + Testing Library                        | 0 €  |
| Qualité     | ESLint 10 + Prettier                                                   | 0 €  |
| Hébergement | GitHub Pages (via GitHub Actions)                                      | 0 €  |

## Démarrage

Prérequis : **Node.js 22+** (voir `.nvmrc`) et npm.

```bash
npm ci                 # dépendances exactes du lockfile
cp .env.example .env.local   # puis renseigner les variables (voir ci-dessous)
npm run dev            # http://localhost:5173/ludotheque/
```

### Variables d'environnement

| Variable                  | Rôle                               | Visible client |
| ------------------------- | ---------------------------------- | -------------- |
| `VITE_API_URL`            | URL `/exec` du Web App Apps Script | Oui (normal)   |
| `VITE_TURNSTILE_SITE_KEY` | Clé publique Turnstile             | Oui (normal)   |
| `VITE_BASE_PATH`          | Chemin de déploiement (optionnel)  | Oui            |

Les valeurs `VITE_*` sont intégrées au bundle : **ne jamais y placer un secret**. Le secret
Turnstile vit uniquement dans les propriétés du script Apps Script.

### Tester en local sous Windows

Double-cliquez sur **`start-local.cmd`** (ou lancez `start-local` dans un terminal) : le script
vérifie Node.js, installe les dépendances si besoin, démarre le serveur et ouvre le navigateur.

| Commande              | Effet                                                                         |
| --------------------- | ----------------------------------------------------------------------------- |
| `start-local`         | Serveur de développement avec rechargement à chaud (port 5173)                |
| `start-local preview` | Build de production + serveur, pour tester la PWA et l'hors-ligne (port 4173) |
| `start-local help`    | Affiche l'aide                                                                |

`Ctrl+C` arrête le serveur.

## Scripts

| Commande                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Serveur de développement                     |
| `npm run build`         | Typecheck + build de production dans `dist/` |
| `npm run preview`       | Sert le build (test du service worker)       |
| `npm run lint`          | ESLint                                       |
| `npm run typecheck`     | Vérification TypeScript                      |
| `npm run test`          | Tests unitaires                              |
| `npm run test:watch`    | Tests en watch                               |
| `npm run test:coverage` | Rapport de couverture                        |
| `npm run format`        | Prettier (écriture)                          |
| `npm run format:check`  | Prettier (vérification)                      |

## Structure

```
.
├── .github/              # workflows CI/CD, Dependabot, template de PR
├── .opencode/skills/     # skills agents IA (ponytail, ludotheque)
├── backend/apps-script/  # code du Web App Apps Script (à créer)
├── docs/                 # règles du projet, lisibles par un humain et un agent IA
├── public/               # 404.html, favicon, icônes PWA (provisoires)
├── src/                  # accueillera le code de l'application
├── index.html            # coquille HTML (#root)
├── start-local.cmd       # lanceur Windows
├── AGENTS.md             # point d'entrée des agents IA
└── vite.config.ts
```

## Documentation

Les règles du projet sont dans [`docs/`](docs/README.md). Point d'entrée pour les agents IA :
[`AGENTS.md`](AGENTS.md).

- [Produit](docs/product.md) — vision, périmètre, exigences
- [Architecture](docs/architecture.md) — stack, flux, Apps Script, structure cible
- [Conventions](docs/conventions.md) — TypeScript, React, CSS, nommage
- [Design](docs/design.md) — maquette, responsive, style, validation visuelle
- [Données Google Sheets](docs/data-google-sheet.md) — schéma, API, validation
- [Sécurité](docs/security.md) — Turnstile, anti-abus, secrets, CORS
- [Mentions légales](docs/legal.md) — LCEN, RGPD, cookies
- [PWA](docs/pwa.md) — installation depuis les Réglages, hors-ligne
- [Qualité](docs/quality.md) — tests, CI, plan de recette
- [Workflow Git](docs/git-workflow.md) — branches, commits, PR
- [Déploiement](docs/deployment.md) — GitHub Pages, Apps Script, variables
- [Workflow IA](docs/ai-workflow.md) — Graphify, Ponytail, skills
- [Décisions](docs/decisions.md) — journal et questions ouvertes
- [Roadmap](docs/roadmap.md) — phases et critères de sortie

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : lint → types → tests → build →
publication sur GitHub Pages.

Activation initiale : **Settings → Pages → Source : GitHub Actions**.

Le chemin de base est calculé automatiquement (`/<nom-du-dépôt>/`). Pour un domaine personnalisé,
définir la variable de dépôt `VITE_BASE_PATH=/`. Détails et dépannage :
[docs/deployment.md](docs/deployment.md).

## Prochaines étapes

1. Recevoir les wireframes, la maquette et les références de style
   ([docs/design.md](docs/design.md)).
2. Trancher les questions ouvertes de [docs/decisions.md](docs/decisions.md).
3. Mettre en place la Google Sheet, le Web App Apps Script et Turnstile
   ([docs/data-google-sheet.md](docs/data-google-sheet.md), [docs/security.md](docs/security.md)).
4. Développer les écrans, mobile d'abord, puis les tests.
5. Remplacer les icônes PWA provisoires par celles de la charte graphique.

## Contribuer

1. Créer une branche : `feat/ma-fonctionnalite`, `fix/mon-bug`, `docs/…`
2. Coder en respectant [docs/conventions.md](docs/conventions.md) et la maquette
3. Vérifier localement :
   `npm run format && npm run lint && npm run typecheck && npm run test && npm run build`
4. Mettre à jour le README et `docs/` dans la même PR
5. Ouvrir une pull request (le template est prérempli)
