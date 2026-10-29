# Architecture

## Vue d'ensemble

Application **100 % statique** : aucun serveur, aucune base de données. Le build Vite produit des
fichiers HTML/CSS/JS servis par GitHub Pages. La configuration PWA (manifest + service worker) est
déjà en place ; l'interface reste à développer.

```
Navigateur
  └── index.html (coquille générée par Vite)
        ├── <div id="root">        → point de montage React (à brancher)
        └── sw.js                  → service worker (Workbox, généré au build)
```

## État actuel du dépôt

| Présent                                          | Absent (à venir avec les maquettes)               |
| ------------------------------------------------ | ------------------------------------------------- |
| Build Vite, alias `@/`, base GitHub Pages        | Code applicatif (`src/`)                          |
| TypeScript strict, ESLint, Prettier              | Écrans et composants                              |
| Manifest PWA, service worker, icônes provisoires | Routage                                           |
| CI (lint/types/tests/build) et déploiement Pages | Tests (aucun test pour l'instant)                 |
| `start-local.cmd`                                | Source de données (statique, API, stockage local) |

`src/` ne contient que `vite-env.d.ts` (types d'environnement Vite et PWA). `index.html` ne
charge **aucun** script : c'est volontaire tant que l'application n'existe pas.

## Brancher l'application

1. Créer `src/main.tsx` (point d'entrée React).
2. Ajouter dans `index.html`, avant `</body>` :
   ```html
   <script type="module" src="/src/main.tsx"></script>
   ```
3. Lancer `start-local` : le serveur sert l'application sur `http://localhost:5173/ludotheque/`.

## Structure cible (à valider avec les maquettes)

Proposition de départ, à ajuster selon les écrans réels :

```
src/
├── components/     # composants présentationnels réutilisables
├── features/       # (optionnel) un dossier par domaine fonctionnel
├── hooks/          # hooks React réutilisables
├── lib/            # logique pure, sans React, testable
├── services/       # accès aux données (statique, API, localStorage)
├── styles/         # (optionnel) styles globaux et thèmes
├── App.tsx         # composition de l'écran principal
├── main.tsx        # bootstrap React
└── types.ts        # types partagés du domaine
```

Règle de dépendance :

```
components  →  lib  →  types
     ↓         ↑
   hooks ──────┘
     ↓
 services (effets de bord : stockage, réseau)
```

- `lib/` ne contient **aucun** import React : fonctions pures, testables isolément.
- `components/` ne fait pas d'accès direct au stockage ou au réseau : il reçoit des props.
- `hooks/` encapsule les effets de bord (stockage, abonnements, timers).
- `services/` centralise les appels réseau et la persistance.
- `types.ts` ne dépend de rien.

## Décisions techniques

| Sujet       | Choix                       | Raison                                                           |
| ----------- | --------------------------- | ---------------------------------------------------------------- |
| Build       | Vite                        | Démarrage rapide, sortie statique, écosystème PWA mature         |
| UI          | React + TypeScript strict   | Typage du domaine, composants simples à tester                   |
| Styles      | CSS natif                   | Aucune dépendance runtime, thème centralisé dans `:root`         |
| PWA         | `vite-plugin-pwa` (Workbox) | Manifest + service worker générés au build, précache automatique |
| Tests       | Vitest + Testing Library    | Même outillage que Vite, exécution rapide                        |
| Hébergement | GitHub Pages                | Gratuit, HTTPS, adapté à un site statique                        |

## Points à trancher avec la maquette

À documenter ici dès que les choix sont faits :

1. **Routage** : aucune route pour l'instant, puis `HashRouter` ou `BrowserRouter` (voir
   [deployment.md](./deployment.md#routage-côté-client)).
2. **Styles** : CSS natif (choix actuel), CSS Modules ou Tailwind.
3. **Données** : collection statique, fichier JSON, `localStorage` ou API distante.
4. **État global** : `useState` local, Context ou bibliothèque dédiée (uniquement si nécessaire).
5. **Thème** : clair/sombre, couleurs et typographie issus de la charte.

Toute décision structurante se documente dans ce fichier et dans le README, dans le même commit
que le code concerné.
