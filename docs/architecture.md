# Architecture

## Vue d'ensemble

Application **100 % statique** : aucun serveur, aucune base de données. Le build Vite produit des
fichiers HTML/CSS/JS servis par GitHub Pages. La persistance utilisateur repose sur
`localStorage`.

```
Navigateur
  └── index.html (généré par Vite)
        ├── src/main.tsx        → point d'entrée React
        ├── src/App.tsx         → écran principal (recherche, filtres, favoris)
        └── sw.js               → service worker (Workbox, généré par vite-plugin-pwa)
```

## Structure des dossiers

```
.
├── .github/
│   ├── workflows/ci.yml           # lint + types + tests + build sur PR/push
│   ├── workflows/deploy.yml       # build + publication GitHub Pages sur main
│   ├── dependabot.yml             # mises à jour automatisées
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                          # règles du projet (ce dossier)
├── public/                        # fichiers copiés tels quels dans dist/
│   ├── icons/                     # icônes PWA (192, 512, maskable)
│   ├── 404.html                   # redirection SPA sur GitHub Pages
│   ├── favicon.svg
│   └── apple-touch-icon.png
├── scripts/
│   └── generate-icons.ps1         # régénération des icônes PNG
├── src/
│   ├── components/                # composants présentationnels réutilisables
│   ├── data/                      # données statiques (collection de jeux)
│   ├── hooks/                     # hooks React réutilisables
│   ├── lib/                       # logique pure, testable, sans React
│   ├── test/                      # setup Vitest et doublures
│   ├── App.tsx                    # composition de l'écran principal
│   ├── main.tsx                   # bootstrap React
│   ├── index.css                  # styles globaux (design tokens inclus)
│   └── types.ts                   # types partagés du domaine
├── index.html
├── vite.config.ts                 # base path, alias, plugin PWA
└── vitest.config.ts
```

## Règle de dépendance entre couches

```
components  →  lib  →  types
     ↓         ↑
   hooks ──────┘
     ↓
  data (données statiques)
```

- `lib/` ne contient **aucun** import React : ce sont des fonctions pures, testables isolément.
- `components/` ne fait pas d'accès direct au `localStorage` : il reçoit des props.
- `hooks/` encapsule les effets de bord (stockage, abonnements, timers).
- `App.tsx` orchestre l'état et passe les données aux composants.
- `types.ts` ne dépend de rien.

## Décisions techniques

| Sujet       | Choix                       | Raison                                                           |
| ----------- | --------------------------- | ---------------------------------------------------------------- |
| Build       | Vite                        | Démarrage rapide, sortie statique, écosystème PWA mature         |
| UI          | React + TypeScript strict   | Typage du domaine, composants simples à tester                   |
| Styles      | CSS natif + variables       | Aucune dépendance runtime, thème centralisé dans `:root`         |
| PWA         | `vite-plugin-pwa` (Workbox) | Manifest + service worker générés au build, précache automatique |
| Persistance | `localStorage`              | Aucun backend ; suffisant pour favoris et préférences            |
| Tests       | Vitest + Testing Library    | Même outillage que Vite, exécution rapide                        |
| Hébergement | GitHub Pages                | Gratuit, HTTPS, adapté à un site statique                        |
| Routage     | Aucun (mono-écran)          | Pas de dépendance routeur tant que le besoin n'existe pas        |

### Ajouter un routeur plus tard

Si plusieurs écrans deviennent nécessaires :

1. Utiliser `react-router` en mode `HashRouter` (le plus simple sur GitHub Pages) **ou**
   `BrowserRouter` avec `basename={import.meta.env.BASE_URL}`.
2. Pour `BrowserRouter`, mettre en place la technique « spa-github-pages » (voir
   [deployment.md](./deployment.md#routage-côté-client)).
3. Adapter `navigateFallback` dans `vite.config.ts` pour exclure les fichiers statiques.

## Données

`src/data/games.ts` expose une collection typée `readonly Game[]`. Pour brancher une vraie
source :

1. Créer un module `src/services/` (ex. `gamesRepository.ts`) qui retourne `Promise<Game[]>`.
2. Charger les données dans un hook (`useGames`) avec états `loading` / `error` / `data`.
3. Prévoir un cache (`localStorage` ou Cache API) pour conserver le mode hors ligne.

Toute évolution du modèle se fait d'abord dans `src/types.ts`, puis se propage aux données et
aux tests.
