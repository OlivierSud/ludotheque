# Documentation — Ludothèque

Ce dossier rassemble les règles du projet : architecture, conventions de code, workflow Git,
qualité, PWA et déploiement. **Toute contribution doit respecter ces documents.**

## Sommaire

| Document                             | Contenu                                                    |
| ------------------------------------ | ---------------------------------------------------------- |
| [architecture.md](./architecture.md) | Structure du projet, flux de données, choix techniques     |
| [conventions.md](./conventions.md)   | Règles de code TypeScript, React, CSS, nommage, imports    |
| [git-workflow.md](./git-workflow.md) | Branches, commits conventionnels, pull requests            |
| [quality.md](./quality.md)           | Lint, formatage, tests, intégration continue               |
| [pwa.md](./pwa.md)                   | Manifest, service worker, icônes, cache, mises à jour      |
| [deployment.md](./deployment.md)     | GitHub Pages, `base` path, domaine personnalisé, dépannage |

## Démarrage rapide

```bash
npm ci          # installe les dépendances exactes du package-lock.json
npm run dev     # http://localhost:5173/ludotheque/
npm run test    # tests unitaires (Vitest)
npm run build   # build de production dans dist/
npm run preview # sert le build localement (test du service worker)
```

Sous Windows, `start-local.cmd` fait tout cela : double-clic pour le serveur de développement,
`start-local preview` pour tester la version PWA (build + service worker).

## Règle d'or

> Une fonctionnalité n'est terminée que si : elle est typée, testée (si logique), documentée
> quand elle change une règle du projet, et que `npm run lint`, `npm run typecheck`,
> `npm run test` et `npm run build` passent.

## Mise à jour de la documentation

- Une décision structurante (nouvelle librairie, nouveau dossier, changement de stratégie de
  cache…) se documente **dans le même commit** que le code concerné.
- Les documents restent courts et actionnables : préférer des listes et des exemples concrets.
- Les chemins cités doivent exister dans le dépôt (vérifier avant de merger).
