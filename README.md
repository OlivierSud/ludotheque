# Ludothèque 🎲

Socle technique du projet **Ludothèque** : application web progressive (PWA) destinée à être
déployée sur GitHub Pages.

[![CI](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml)
[![Déploiement](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml)

> **État du projet : socle uniquement.**
> Ce dépôt contient la configuration (build, qualité, CI/CD, PWA) et l'outil de serveur local.
> Aucune interface n'est développée : elle sera construite à partir des wireframes et de la
> maquette à venir. `index.html` n'est qu'une coquille avec `<div id="root"></div>`.

## Contenu du dépôt

| Élément                        | Rôle                                                      |
| ------------------------------ | --------------------------------------------------------- |
| `vite.config.ts`               | Build, `base` GitHub Pages, alias `@/`, configuration PWA |
| `vitest.config.ts`             | Configuration des tests (aucun test pour l'instant)       |
| `tsconfig*.json`               | TypeScript strict (app + fichiers de config)              |
| `eslint.config.js`             | Règles de lint (flat config)                              |
| `.prettierrc.json`             | Formatage du code                                         |
| `.github/workflows/ci.yml`     | Lint, types, tests et build sur PR et `main`              |
| `.github/workflows/deploy.yml` | Publication automatique sur GitHub Pages                  |
| `public/`                      | `404.html` (redirection SPA) + icônes PWA provisoires     |
| `start-local.cmd`              | Lancement du serveur local sous Windows                   |
| `docs/`                        | Règles du projet (architecture, conventions, PWA, etc.)   |

## Stack

| Domaine     | Choix                                                          |
| ----------- | -------------------------------------------------------------- |
| Build       | [Vite](https://vite.dev/) 8                                    |
| UI          | [React](https://react.dev/) 19 + TypeScript strict             |
| Styles      | CSS natif (aucune dépendance runtime)                          |
| PWA         | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) |
| Tests       | [Vitest](https://vitest.dev/) + Testing Library                |
| Qualité     | ESLint 10 + Prettier                                           |
| Hébergement | GitHub Pages (via GitHub Actions)                              |

## Démarrage

Prérequis : **Node.js 22+** (voir `.nvmrc`) et npm.

```bash
npm ci            # dépendances exactes du lockfile
npm run dev       # http://localhost:5173/ludotheque/
```

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
├── .github/          # workflows CI/CD, Dependabot, template de PR
├── docs/             # règles du projet
├── public/           # 404.html, favicon, icônes PWA (provisoires)
├── src/              # vide : accueillera le code de l'application
├── index.html        # coquille HTML (#root)
├── start-local.cmd   # lanceur Windows
└── vite.config.ts
```

## Documentation

Les règles du projet sont dans [`docs/`](docs/README.md) :

- [Architecture](docs/architecture.md) — socle actuel et structure cible
- [Conventions de code](docs/conventions.md) — TypeScript, React, CSS, nommage
- [Workflow Git](docs/git-workflow.md) — branches, Conventional Commits, PR
- [Qualité](docs/quality.md) — lint, tests, CI, définition de « terminé »
- [PWA](docs/pwa.md) — manifest, service worker, icônes
- [Déploiement](docs/deployment.md) — GitHub Pages, `base` path, dépannage

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : lint → types → tests → build →
publication sur GitHub Pages.

Activation initiale : **Settings → Pages → Source : GitHub Actions**.

Le chemin de base est calculé automatiquement (`/<nom-du-dépôt>/`). Pour un domaine personnalisé,
définir la variable de dépôt `VITE_BASE_PATH=/`. Détails et dépannage :
[docs/deployment.md](docs/deployment.md).

## Prochaines étapes

1. Recevoir les wireframes et la maquette.
2. Créer `src/main.tsx` et le premier écran, en suivant [docs/conventions.md](docs/conventions.md).
3. Remplacer les icônes PWA provisoires (`public/icons/`, `public/favicon.svg`) par celles de la
   charte graphique.
4. Ajouter les tests au fur et à mesure dans `src/**/*.test.tsx`.

## Contribuer

1. Créer une branche : `feat/ma-fonctionnalite`, `fix/mon-bug`, `docs/…`
2. Coder en respectant [docs/conventions.md](docs/conventions.md)
3. Vérifier localement :
   `npm run format && npm run lint && npm run typecheck && npm run test && npm run build`
4. Ouvrir une pull request (le template est prérempli)
