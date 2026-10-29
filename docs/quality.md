# Qualité

## Commandes locales

| Commande                | Effet                                               |
| ----------------------- | --------------------------------------------------- |
| `npm run lint`          | ESLint sur tout le dépôt                            |
| `npm run typecheck`     | Vérification TypeScript (build mode, sans émission) |
| `npm run test`          | Tests unitaires (Vitest, une passe)                 |
| `npm run test:watch`    | Tests en mode watch                                 |
| `npm run test:coverage` | Rapport de couverture (`coverage/`)                 |
| `npm run format`        | Prettier en écriture                                |
| `npm run format:check`  | Vérifie le formatage sans modifier                  |
| `npm run build`         | Typecheck + build de production                     |

Avant chaque push : `npm run format && npm run lint && npm run typecheck && npm run test`.

## Outillage

- **ESLint 10** (flat config, `eslint.config.js`) : `@eslint/js`, `typescript-eslint`,
  `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
- **Prettier** (`.prettierrc.json`) : 100 colonnes, guillemets simples, virgules finales.
  `eslint-config-prettier` désactive les règles de style d'ESLint pour éviter les conflits.
- **Vitest 5** + **Testing Library** + **jsdom** pour les tests d'interface.
- **GitHub Actions** : `ci.yml` rejoue tout sur chaque PR et sur `main`.

## Stratégie de test

Aucun test n'existe pour l'instant. Vitest est configuré avec `passWithNoTests: true` afin que la
CI reste verte tant que l'application n'est pas développée. Les premiers tests arriveront avec le
code.

| Niveau           | Emplacement         | À tester                                            |
| ---------------- | ------------------- | --------------------------------------------------- |
| Logique pure     | `src/lib/*.test.ts` | fonctions de calcul, formatage, cas limites         |
| Composants/écran | `src/**/*.test.tsx` | rendu, interactions utilisateur, persistance        |
| PWA / offline    | manuel              | installation, rechargement hors ligne (voir pwa.md) |

Principes :

1. Tester le **comportement observable**, pas l'implémentation (pas de snapshot de markup).
2. Requêtes Testing Library par rôle/label : `getByRole`, `getByLabelText` — jamais par classe CSS.
3. Chaque bug corrigé arrive avec un test qui échouait avant.
4. Ne pas viser 100 % : viser la couverture des règles métier et des cas limites.
5. Un test doit être déterministe : pas de `sleep`, pas de dépendance à la date du jour.

Exemple minimal (fonction pure) :

```ts
import { describe, expect, it } from 'vitest';
import { formatCount } from '@/lib/format';

describe('formatCount', () => {
  it('accorde le pluriel', () => {
    expect(formatCount(1)).toBe('1 élément');
    expect(formatCount(2)).toBe('2 éléments');
  });
});
```

## Tests de la PWA en local

Le service worker n'est actif qu'en build :

```bash
npm run build
npm run preview   # http://localhost:4173/ludotheque/
```

Sous Windows, `start-local preview` enchaîne le build et le serveur de prévisualisation.

Puis : DevTools → Application → Service Workers (vérifier « activated »), cocher « Offline » et
recharger. L'application doit rester fonctionnelle.

## Intégration continue

`ci.yml` (PR + `main`) exécute dans l'ordre : `format:check` → `lint` → `typecheck` → `test` →
`build`, puis publie `dist` comme artefact 7 jours.

`deploy.yml` (push sur `main` ou déclenchement manuel) refait lint/types/tests, construit avec le
bon `base` et publie sur GitHub Pages. Voir [deployment.md](./deployment.md).

## Définition de « terminé »

- [ ] Comportement conforme, y compris cas vides et erreurs
- [ ] Types stricts, aucun `any`
- [ ] Tests ajoutés/mis à jour
- [ ] `lint`, `typecheck`, `test`, `build` verts
- [ ] Accessibilité vérifiée au clavier
- [ ] Documentation mise à jour si une règle change
