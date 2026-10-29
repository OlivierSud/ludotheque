# Qualité

## Commandes locales

| Commande                | Effet                               |
| ----------------------- | ----------------------------------- |
| `npm run lint`          | ESLint sur tout le dépôt            |
| `npm run typecheck`     | Vérification TypeScript             |
| `npm run test`          | Tests unitaires (Vitest)            |
| `npm run test:watch`    | Tests en watch                      |
| `npm run test:coverage` | Rapport de couverture (`coverage/`) |
| `npm run format`        | Prettier en écriture                |
| `npm run format:check`  | Vérifie le formatage                |
| `npm run build`         | Typecheck + build de production     |

Avant chaque push :
`npm run format && npm run lint && npm run typecheck && npm run test && npm run build`.

## Outillage

- **ESLint 10** (flat config) : `@eslint/js`, `typescript-eslint`, règles React Hooks.
- **Prettier** : 100 colonnes, guillemets simples, virgules finales.
- **Vitest 5** + **Testing Library** + **jsdom**.
- **GitHub Actions** : `ci.yml` sur chaque PR et sur `main`.

## Stratégie de test

Aucun test n'existe encore. `passWithNoTests` est activé pour que la CI reste verte jusqu'au
premier écran.

| Niveau                | Emplacement                                 | À couvrir                                                 |
| --------------------- | ------------------------------------------- | --------------------------------------------------------- |
| Logique pure          | `src/lib/*.test.ts`                         | validation, filtres, formatage, cas limites               |
| Services              | `src/services/*.test.ts`                    | contrat API (succès, erreurs, timeout) avec `fetch` mocké |
| Composants/écran      | `src/**/*.test.tsx`                         | rendu, interactions, états vide/chargement/erreur         |
| Backend (Apps Script) | `backend/apps-script/*.test.js` (optionnel) | validation, vérification Turnstile (mock)                 |
| PWA / hors-ligne      | manuel                                      | installation, cache, mise à jour                          |

Principes :

1. Tester le **comportement observable**, pas l'implémentation (pas de snapshot de markup).
2. Requêtes par rôle/label (`getByRole`, `getByLabelText`), jamais par classe CSS.
3. Chaque bug corrigé arrive avec un test qui échouait avant.
4. Un test est déterministe : pas de `sleep`, pas de dépendance à la date ou au réseau réel.
5. La validation serveur se teste avec des payloads **invalides** (champs manquants, bornes,
   types, XSS, URL `javascript:`).

## Plan de recette manuel

À exécuter avant chaque mise en production :

### Fonctionnel

- [ ] Liste chargée (état de chargement visible)
- [ ] Recherche : accents, casse, aucun résultat
- [ ] Filtres : chaque catégorie, combinaisons, réinitialisation
- [ ] Fiche d'un jeu : toutes les données, retour à la liste
- [ ] Ajout valide → apparaît dans la liste
- [ ] Ajout invalide → erreurs de champ, rien en base
- [ ] Turnstile absent/expiré → refus explicite
- [ ] Double clic sur « Ajouter » → une seule ligne créée
- [ ] Réseau coupé → message clair, cache affiché

### Responsive (à tester réellement)

| Largeur | Cible                       |
| ------- | --------------------------- |
| 360 px  | Petit mobile Android        |
| 390 px  | iPhone 12/13/14             |
| 768 px  | Tablette portrait           |
| 1024 px | Tablette paysage / petit PC |
| 1440 px | Desktop                     |

- [ ] Aucun scroll horizontal
- [ ] Zones tactiles ≥ 44 px
- [ ] Lisibilité et contrastes
- [ ] Navigation clavier complète (Tab, Entrée, Échap)

### PWA

- [ ] Installation depuis Réglages (Android/Chrome)
- [ ] Instructions iOS affichées correctement
- [ ] Entrée masquée si déjà installée
- [ ] Hors ligne : liste et filtres fonctionnels
- [ ] Mise à jour : comportement conforme à la décision validée

### Légal

- [ ] Mentions légales accessibles (pied de page + Réglages)
- [ ] Politique de confidentialité à jour
- [ ] Aucun cookie non déclaré

## Intégration continue

`ci.yml` (PR + `main`) : `format:check` → `lint` → `typecheck` → `test` → `build`, puis publication
de `dist` en artefact 7 jours.

`deploy.yml` (push sur `main` ou manuel) : mêmes vérifications, build avec le bon `base`, puis
publication GitHub Pages.

Une PR ne se merge pas si la CI est rouge.

## Couverture

Pas d'objectif chiffré global. Objectif ciblé :

- 100 % des règles de validation (client et serveur) ;
- 100 % des fonctions de `src/lib/` ;
- les parcours critiques (ajout, recherche, états d'erreur).

## Définition de « terminé »

- [ ] Conforme à la maquette (mobile + desktop) et à `docs/product.md`
- [ ] Types stricts, aucun `any`
- [ ] Tests ajoutés/mis à jour
- [ ] `lint`, `typecheck`, `test`, `build` verts
- [ ] Accessibilité vérifiée au clavier et en contraste
- [ ] README et `docs/` à jour
- [ ] Décision consignée dans `decisions.md`
- [ ] Aucun secret, aucune donnée personnelle dans le dépôt
