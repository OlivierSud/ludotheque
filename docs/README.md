# Documentation — Ludothèque

Règles du projet, lisibles par un humain **et** par un agent IA. Toute contribution doit les
respecter.

## Sommaire

| Document                                       | Contenu                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| [product.md](./product.md)                     | Vision, périmètre, exigences fonctionnelles et non fonctionnelles |
| [architecture.md](./architecture.md)           | Stack, flux de données, Apps Script, structure cible              |
| [conventions.md](./conventions.md)             | TypeScript, React, CSS, nommage, imports, accessibilité           |
| [design.md](./design.md)                       | Maquette, responsive, style, process de validation visuelle       |
| [data-google-sheet.md](./data-google-sheet.md) | Schéma de la feuille, contrat d'API, validation                   |
| [security.md](./security.md)                   | Turnstile, anti-abus, secrets, CORS                               |
| [legal.md](./legal.md)                         | Mentions légales, RGPD, cookies, sous-traitants                   |
| [pwa.md](./pwa.md)                             | Installation depuis les Réglages, service worker, hors-ligne      |
| [quality.md](./quality.md)                     | Tests, CI, plan de recette, définition de « terminé »             |
| [git-workflow.md](./git-workflow.md)           | Branches, commits, pull requests, versionnement                   |
| [deployment.md](./deployment.md)               | GitHub Pages, Apps Script, variables et secrets                   |
| [ai-workflow.md](./ai-workflow.md)             | Graphify, Ponytail, skills, boucle de travail des agents          |
| [decisions.md](./decisions.md)                 | Journal des décisions et questions ouvertes                       |
| [roadmap.md](./roadmap.md)                     | Phases, livrables et critères de sortie                           |

## Règle d'or

> Une fonctionnalité n'est terminée que si elle respecte la maquette, fonctionne sur mobile et sur
> PC, est testée, documentée, et que `lint`, `typecheck`, `test` et `build` passent.

## Conventions de lecture pour les agents

- Les sections **« Règles »** sont impératives (MUST).
- Les sections **« À valider »** listent des décisions non tranchées : ne pas les implémenter.
- Les tableaux **« Questions ouvertes »** de `decisions.md` sont bloquants tant qu'elles ne sont
  pas répondues.
- Les chemins cités doivent exister : vérifier avant de merger.

## Mise à jour

- Une décision structurante se documente dans le même commit que le code concerné.
- Le README est mis à jour à chaque changement visible (stack, scripts, périmètre, état).
- Un document reste court et actionnable : listes, tableaux, exemples concrets.
