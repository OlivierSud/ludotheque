# Workflow Git

## Branches

| Branche         | Rôle                                                   |
| --------------- | ------------------------------------------------------ |
| `main`          | Branche protégée, toujours déployable sur GitHub Pages |
| `feat/<sujet>`  | Nouvelle fonctionnalité                                |
| `fix/<sujet>`   | Correction de bug                                      |
| `docs/<sujet>`  | Documentation seule                                    |
| `chore/<sujet>` | Outillage, dépendances, CI                             |

- `main` ne reçoit que des merges de pull requests.
- Une branche = un sujet, durée de vie courte (< 1 semaine).
- Rebaser sur `main` avant d'ouvrir la PR : `git fetch && git rebase origin/main`.

## Messages de commit — Conventional Commits

Format : `<type>(<scope>): <description à l'impératif, en français>`

| Type       | Usage                                      |
| ---------- | ------------------------------------------ |
| `feat`     | Nouvelle fonctionnalité                    |
| `fix`      | Correction de bug                          |
| `docs`     | Documentation                              |
| `style`    | Formatage (sans impact logique)            |
| `refactor` | Réécriture sans changement de comportement |
| `test`     | Ajout ou correction de tests               |
| `chore`    | Dépendances, CI, outillage                 |
| `perf`     | Amélioration de performance                |

Exemples :

```
feat(games): afficher la liste des jeux
feat(settings): proposer l'installation PWA
fix(api): refuser un jeton Turnstile expiré
docs(security): documenter la configuration Turnstile
chore(deps): mettre à jour vite
```

Règles :

- Description ≤ 72 caractères, sans point final.
- Un commit = un changement cohérent qui compile et passe les tests.
- Le corps explique le **pourquoi**.

## Pull requests

1. Remplir `.github/PULL_REQUEST_TEMPLATE.md`.
2. CI verte obligatoire (lint, types, tests, build).
3. Une PR = un sujet ; séparer les changements sans rapport.
4. **Mettre à jour le README et `docs/` dans la même PR** si une règle, une dépendance, un contrat
   d'API ou un écran change.
5. Consigner les décisions dans `docs/decisions.md`.
6. Merge en **squash**.

## Règle documentation

| Changement                           | Documents à mettre à jour                      |
| ------------------------------------ | ---------------------------------------------- |
| Nouvelle dépendance / service        | `README.md`, `architecture.md`, `decisions.md` |
| Changement d'API ou de schéma Sheets | `data-google-sheet.md`, `security.md`          |
| Nouvel écran / composant             | `product.md`, `design.md`                      |
| Changement de sécurité               | `security.md`, `legal.md` (si données)         |
| Nouveau script npm                   | `README.md`, `quality.md`                      |
| Changement de déploiement            | `deployment.md`                                |

Un README obsolète est un bug.

## Versionnement

- SemVer : `MAJOR.MINOR.PATCH` dans `package.json`.
- `feat` → `MINOR`, `fix`/`perf` → `PATCH`, changement cassant → `MAJOR`.
- Tag Git `vX.Y.Z` à chaque release ; version affichée dans Réglages.

## À ne jamais committer

- `node_modules/`, `dist/`, `coverage/`, `dev-dist/`
- `.env`, `.env.local` et tout secret
- Clés Turnstile secrètes, `SHEET_ID`, tokens
- Fichiers générés (`sw.js`, `manifest.webmanifest`)
- Artefacts d'éditeur ou d'OS
