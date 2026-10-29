# Workflow Git

## Branches

| Branche         | Rôle                                                   |
| --------------- | ------------------------------------------------------ |
| `main`          | Branche protégée, toujours déployable sur GitHub Pages |
| `feat/<sujet>`  | Nouvelle fonctionnalité                                |
| `fix/<sujet>`   | Correction de bug                                      |
| `docs/<sujet>`  | Documentation seule                                    |
| `chore/<sujet>` | Outillage, dépendances, CI                             |

- `main` ne reçoit **que** des merges de pull requests (ou des commits directs pour les
  hotfix critiques, à éviter).
- Une branche = un sujet. Durée de vie courte (< 1 semaine).
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
feat(ui): ajouter l'écran de liste des jeux
fix(pwa): corriger le start_url du manifest
docs(conventions): préciser la règle d'import des types
chore(deps): mettre à jour vite et vitest
```

Règles :

- Description ≤ 72 caractères, sans point final.
- Un commit = un changement cohérent qui compile et passe les tests.
- Le corps (optionnel) explique le **pourquoi**, pas le **comment**.

## Pull requests

1. Remplir le template `.github/PULL_REQUEST_TEMPLATE.md`.
2. La CI (`ci.yml`) doit être verte : lint, types, tests, build.
3. Une PR = un sujet ; les changements sans rapport sont séparés.
4. Toute évolution d'API interne ou de règle du projet met à jour `docs/` dans la même PR.
5. Merge en **squash** pour garder un historique linéaire sur `main`.

## Versionnement

- SemVer à partir de la première version publique : `MAJOR.MINOR.PATCH`.
- `feat` → `MINOR`, `fix`/`perf` → `PATCH`, changement cassant → `MAJOR`.
- La version affichée vit dans `package.json` ; créer un tag Git `vX.Y.Z` à chaque release.

## À ne jamais committer

- `node_modules/`, `dist/`, `coverage/`
- `.env` et tout fichier contenant un secret
- Des fichiers de build (`sw.js`, `manifest.webmanifest`) : ils sont générés
- Des artefacts d'éditeur ou d'OS (voir `.gitignore`)
