# Ludothèque 🎲

Application web progressive (PWA) pour parcourir et organiser sa collection de jeux de société.
Statique, installable, utilisable hors ligne et déployée automatiquement sur GitHub Pages.

[![CI](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/ci.yml)
[![Déploiement](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml/badge.svg)](https://github.com/OlivierSud/ludotheque/actions/workflows/deploy.yml)

**Application en ligne :** https://oliviersud.github.io/ludotheque/

## Fonctionnalités

- 🔍 Recherche instantanée (insensible à la casse et aux accents) sur le titre, la description,
  la catégorie et les tags
- 🏷️ Filtrage par catégorie (Ambiance, Famille, Stratégie, Coopératif, Enfants)
- ⭐ Favoris persistés dans le navigateur (`localStorage`)
- 📱 Interface responsive, accessible au clavier
- 📲 Installable sur mobile et desktop (manifest + service worker)
- 📴 Fonctionne hors ligne après la première visite
- 🔄 Bannière de mise à jour lors d'un nouveau déploiement

## Stack

| Domaine     | Choix                                                          |
| ----------- | -------------------------------------------------------------- |
| Build       | [Vite](https://vite.dev/) 8                                    |
| UI          | [React](https://react.dev/) 19 + TypeScript strict             |
| Styles      | CSS natif (variables + BEM simplifié)                          |
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

Le service worker n'est **pas** actif en développement. Pour tester la PWA :

```bash
npm run build
npm run preview   # http://localhost:4173/ludotheque/
```

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
src/
├── components/   # composants présentationnels
├── data/         # collection de jeux (données statiques)
├── hooks/        # hooks réutilisables (localStorage…)
├── lib/          # logique pure et testable
├── test/         # setup Vitest
├── App.tsx       # écran principal
└── types.ts      # modèle du domaine
```

Détail complet : [docs/architecture.md](docs/architecture.md).

## Documentation

Les règles du projet sont dans [`docs/`](docs/README.md) :

- [Architecture](docs/architecture.md) — structure, flux, décisions techniques
- [Conventions de code](docs/conventions.md) — TypeScript, React, CSS, nommage
- [Workflow Git](docs/git-workflow.md) — branches, Conventional Commits, PR
- [Qualité](docs/quality.md) — lint, tests, CI, définition de « terminé »
- [PWA](docs/pwa.md) — manifest, service worker, icônes, cache
- [Déploiement](docs/deployment.md) — GitHub Pages, `base` path, dépannage

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml` : lint → types → tests → build →
publication sur GitHub Pages.

Activation initiale : **Settings → Pages → Source : GitHub Actions**.

Le chemin de base est calculé automatiquement (`/<nom-du-dépôt>/`). Pour un domaine personnalisé,
définir la variable de dépôt `VITE_BASE_PATH=/`. Détails et dépannage :
[docs/deployment.md](docs/deployment.md).

## Contribuer

1. Créer une branche : `feat/ma-fonctionnalite`, `fix/mon-bug`, `docs/…`
2. Coder en respectant [docs/conventions.md](docs/conventions.md)
3. Vérifier localement : `npm run format && npm run lint && npm run typecheck && npm run test && npm run build`
4. Ouvrir une pull request (le template est prérempli)

## Feuille de route

- [ ] Import/export de la collection (JSON)
- [ ] Édition d'un jeu et ajout manuel
- [ ] Tri (titre, durée, nombre de joueurs, âge)
- [ ] Thème clair / sombre
- [ ] Routage par jeu (`/jeux/:id`) et partage d'URL
