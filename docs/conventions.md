# Conventions de code

## Langue

- **Code** (variables, fonctions, types, fichiers) : anglais.
- **Interface utilisateur, commentaires, documentation, messages de commit** : français.
- Les valeurs métier restent en français (ex. `categorie: 'Coopératif'`), car elles sont
  affichées telles quelles et validées par le serveur.

## Règles projet

Ces règles priment sur toute préférence personnelle :

1. **Demander avant** toute décision structurante (`AGENTS.md` §3).
2. **Aucune dépendance** ajoutée sans validation : d'abord la plateforme, la stdlib, l'existant.
3. **Gratuité** : pas de service payant, d'essai limité ni de quota qui expire.
4. **Maquette** : aucune couleur, taille ou composant inventé.
5. **Mobile d'abord**, puis desktop ; les deux sont testés.
6. **Aucun secret** dans le dépôt ; les `VITE_*` sont publics par définition.
7. **Documentation** mise à jour dans le même commit que le code.

## TypeScript

- `strict` est activé, ainsi que `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` et
  `verbatimModuleSyntax`. Ne jamais les désactiver localement sans justification écrite.
- **Pas de `any`.** Utiliser `unknown` puis affiner, ou typer correctement. Les assertions
  (`as`) sont tolérées uniquement aux frontières (parsing, `localStorage`).
- Importer les types avec `import type` :
  ```ts
  import type { Game } from '@/types';
  ```
- Préférer `interface` pour les objets publics et `type` pour les unions/alias.
- Utiliser des **unions littérales** plutôt que des `enum` :
  ```ts
  export const CATEGORIES = ['Ambiance', 'Famille', 'Stratégie', 'Coopératif', 'Enfants'] as const;
  export type Category = (typeof CATEGORIES)[number];
  ```
- Les données immuables sont marquées `readonly` (`readonly Game[]`, propriétés `readonly`).
- Éviter les exports par défaut sauf pour les composants d'écran et les fichiers de config.
- Ne pas laisser de code mort, de `console.log` ou de `TODO` sans ticket associé.

## Frontières et validation

Toute donnée venant de l'extérieur (API, `localStorage`, URL) est **inconnue** jusqu'à validation.

```ts
// src/lib/validation.ts — fonction pure, testée
export function parseGame(input: unknown): Game | null {
  if (typeof input !== 'object' || input === null) return null;
  // …vérification champ par champ
}
```

- La validation client sert l'UX ; **la validation serveur fait foi**.
- Un champ invalide ne doit jamais provoquer un crash de rendu : repli explicite.
- Les messages d'erreur sont en français, sans détail technique.

## React

- Composants **fonctionnels** uniquement, un composant par fichier, nommé en `PascalCase`.
- Props déclarées via une `interface` nommée `<Composant>Props`, toutes en `readonly`.
- Pas de `React.FC` : typer directement les props.
- Les composants restent **présentationnels** : aucun appel réseau direct. Les appels passent par
  `src/services/` ; la logique pure vit dans `src/lib/`.
- Les listes utilisent une `key` stable issue des données (`game.id`), jamais l'index.
- Hooks : préfixe `use`, un hook par fichier dans `src/hooks/`.
- `useMemo` / `useCallback` seulement si le calcul est coûteux ou si la stabilité de référence
  est nécessaire. Ne pas en mettre « au cas où ».
- Effets : toujours nettoyer (`clearInterval`, `removeEventListener`, `AbortController`).
- Accessibilité non négociable :
  - tout contrôle interactif est un `<button>` ou un `<input>` natif ;
  - chaque champ a un `<label>` associé (`htmlFor` / `id`) ;
  - les états sont exposés (`aria-pressed`, `aria-live`, `aria-invalid`) ;
  - le focus reste visible (`:focus-visible` défini globalement) ;
  - les zones tactiles font au moins 44 × 44 px.

## Réseau

- Un seul module par ressource : `src/services/gamesApi.ts`.
- Toujours `AbortController` + délai d'expiration (Apps Script peut être lent).
- Vérifier `response.ok` **et** le champ `ok` du JSON (Apps Script répond toujours en HTTP 200).
- POST vers Apps Script en `Content-Type: text/plain;charset=utf-8` (évite le preflight CORS).
- Jamais `mode: 'no-cors'`.
- Ne pas journaliser le jeton Turnstile ni le contenu utilisateur.

## Nommage

| Élément             | Convention             | Exemple                       |
| ------------------- | ---------------------- | ----------------------------- |
| Composant / type    | `PascalCase`           | `GameCard`, `GameFilters`     |
| Fonction / variable | `camelCase`            | `filterGames`, `visibleGames` |
| Constante globale   | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY`                 |
| Hook                | `use` + `PascalCase`   | `useGames`                    |
| Fichier composant   | `PascalCase.tsx`       | `GameCard.tsx`                |
| Fichier utilitaire  | `camelCase.ts`         | `filterGames.ts`              |
| Service             | `camelCase.ts`         | `gamesApi.ts`                 |
| Test                | `<fichier>.test.ts(x)` | `filterGames.test.ts`         |

Le vocabulaire du code suit celui de la maquette (ex. `Game`, `Category`, `Players`).

## Imports

- Alias `@/` obligatoire pour traverser les dossiers : `@/lib/validation`, `@/components/GameCard`.
- Ordre : dépendances externes → alias `@/` → imports relatifs → styles.
- Pas d'import circulaire. En cas de doute, déplacer le type partagé dans `types.ts`.
- Sens des dépendances : `components → hooks → services → lib → types`. Jamais l'inverse.

## CSS

- Un fichier global pour les styles de base et les variables (`src/styles/global.css`).
- **Toutes** les couleurs, rayons, espacements et polices passent par des variables CSS définies
  dans `:root` (voir `docs/design.md`). Aucune valeur codée en dur dans un composant.
- Nommage des classes en **BEM simplifié** : `.card`, `.card__title`, `.card--compact`.
- Mobile-first : les media queries vont dans le sens `min-width`.
- Prévoir `@media (prefers-reduced-motion: reduce)` dans les styles globaux.
- Toute nouvelle classe doit être utilisée ; pas de CSS mort.
- Les couleurs vives ne doivent jamais dégrader le contraste (WCAG AA, 4,5:1).

## Gestion des erreurs

- Les échecs attendus (réseau, JSON invalide, quota) sont gérés avec un repli fonctionnel et un
  message clair.
- Les erreurs de programmation (élément DOM manquant) lèvent une exception explicite.
- Ne jamais afficher un message technique brut à l'utilisateur.
- Un formulaire en erreur conserve la saisie.

## Sécurité

- Aucun secret dans le dépôt : le secret Turnstile vit dans Apps Script, jamais dans le bundle.
- `dangerouslySetInnerHTML` est interdit.
- Les URL d'image sont restreintes à `https://`.
- Les données persistées sont relues avec validation avant usage.

## Performance

- Budget : bundle JS initial < 250 kB (gzip) hors sourcemaps.
- Préférer les imports ciblés et éviter les grosses librairies pour un seul usage.
- Mesurer avec `npm run build` avant d'optimiser ; ne pas optimiser à l'aveugle.
- Les images sont dimensionnées et chargées en `lazy` hors écran.

## Tests

- Un test décrit un comportement, pas une implémentation.
- Requêtes par rôle/label (`getByRole`, `getByLabelText`), jamais par classe CSS.
- Pas de `sleep`, pas de dépendance au réseau réel : mocker `fetch`.
- Chaque bug corrigé arrive avec un test qui échouait avant.
