# Conventions de code

## Langue

- **Code** (variables, fonctions, types, fichiers) : anglais.
- **Interface utilisateur, commentaires, documentation, messages de commit** : français.
- Les identifiants du domaine peuvent rester en français s'ils sont des données métier
  (ex. `category: 'Coopératif'`).

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
- Les données immuables sont marquées `readonly` (`readonly Game[]`, propriétés `readonly`).
- Utiliser des **unions littérales** plutôt que des `enum` :
  ```ts
  export const STATUSES = ['draft', 'published'] as const;
  export type Status = (typeof STATUSES)[number];
  ```
- Éviter les exports par défaut sauf pour les composants d'écran (`App.tsx`) et les configs.
- Ne pas laisser de code mort, de `console.log` ou de `TODO` sans ticket associé.

## React

- Composants **fonctionnels** uniquement, un composant par fichier, nommé en `PascalCase`.
- Props déclarées via une `interface` nommée `<Composant>Props`, toutes en `readonly`.
- Pas de `React.FC` : typer directement les props.
- Les composants restent **présentationnels** : la logique métier vit dans `lib/`.
- Les listes utilisent une `key` stable issue des données (`item.id`), jamais l'index.
- Hooks : préfixe `use`, un hook par fichier dans `src/hooks/`.
- `useMemo` / `useCallback` seulement si le calcul est coûteux ou si la stabilité de référence
  est nécessaire (dépendances de hook, `memo`). Ne pas en mettre « au cas où ».
- Effets : toujours nettoyer (`clearInterval`, `removeEventListener`, `AbortController`).
- Accessibilité non négociable :
  - tout contrôle interactif est un `<button>` ou un `<input>` natif ;
  - chaque champ a un `<label>` associé (`htmlFor` / `id`) ;
  - les états sont exposés (`aria-pressed`, `aria-live`) ;
  - le focus reste visible (`:focus-visible` est défini globalement).

## Nommage

| Élément             | Convention             | Exemple                       |
| ------------------- | ---------------------- | ----------------------------- |
| Composant / type    | `PascalCase`           | `ItemCard`, `ItemFilter`      |
| Fonction / variable | `camelCase`            | `filterItems`, `visibleItems` |
| Constante globale   | `SCREAMING_SNAKE_CASE` | `STORAGE_KEY`                 |
| Hook                | `use` + `PascalCase`   | `useLocalStorage`             |
| Fichier composant   | `PascalCase.tsx`       | `ItemCard.tsx`                |
| Fichier utilitaire  | `camelCase.ts`         | `format.ts`                   |
| Test                | `<fichier>.test.ts(x)` | `format.test.ts`              |

## Imports

- Alias `@/` obligatoire pour traverser les dossiers : `@/lib/format`, `@/components/ItemCard`.
- Ordre : dépendances externes → alias `@/` → imports relatifs → styles.
- Pas d'import circulaire. En cas de doute, déplacer le type partagé dans `types.ts`.

## CSS

- Un fichier global pour les styles de base et les variables (ex. `src/styles/global.css`).
- Toutes les couleurs, rayons et polices passent par des variables CSS définies dans `:root`.
  Aucune couleur codée en dur dans un composant.
- Nommage des classes en **BEM simplifié** : `.card`, `.card__title`, `.card--compact`.
- Mobile-first : les media queries vont dans le sens `min-width`.
- Prévoir un bloc `@media (prefers-reduced-motion: reduce)` dans les styles globaux.
- Toute nouvelle classe doit être utilisée ; ne pas laisser de CSS mort.

## Gestion des erreurs

- Les échecs attendus (stockage indisponible, JSON invalide) sont gérés silencieusement avec un
  repli fonctionnel.
- Les erreurs de programmation (élément DOM manquant) lèvent une exception explicite.
- Ne jamais afficher un message technique brut à l'utilisateur.

## Sécurité

- Aucun secret dans le dépôt : les variables sensibles passent par les _secrets_ GitHub.
- Ne pas injecter de HTML utilisateur (`dangerouslySetInnerHTML` interdit sans validation).
- Les données persistées sont relues avec validation avant usage dès qu'elles proviennent d'une
  source externe.

## Performance

- Budget : bundle JS initial < 250 kB (gzip) hors sourcemaps.
- Préférer les imports ciblés et éviter les grosses librairies pour un seul usage.
- Mesurer avec `npm run build` avant d'optimiser ; ne pas optimiser à l'aveugle.
