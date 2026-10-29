# Journal des décisions

Chaque décision structurante est consignée ici. Une décision non validée reste **proposée** et ne
doit pas être implémentée.

## Statuts

| Statut      | Signification                                 |
| ----------- | --------------------------------------------- |
| `proposé`   | Rédigé, en attente de validation utilisateur  |
| `accepté`   | Validé, fait foi                              |
| `remplacé`  | Remplacé par une décision plus récente (lien) |
| `abandonné` | Étudié puis écarté                            |

## Décisions

### D-001 — Socle technique Vite + React + TypeScript

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : Vite 8, React 19, TypeScript strict, CSS natif, Vitest, ESLint, Prettier.
- **Conséquences** : build statique, aucun serveur applicatif, déploiement GitHub Pages.

### D-002 — Hébergement GitHub Pages + déploiement par Actions

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : publication automatique sur `main` via `deploy.yml`, base `/<dépôt>/`.
- **Conséquences** : pas de contrôle des en-têtes HTTP, SPA à gérer via `404.html` ou HashRouter.

### D-003 — Données dans Google Sheets via Apps Script

- **Statut** : proposé
- **Date** : 2026-11-02
- **Décision** : la feuille n'est jamais lue directement ; un Web App Apps Script sert d'API
  (lecture + écriture) et garde le secret Turnstile.
- **Alternatives** : API Sheets avec clé (impossible en écriture sans OAuth) ; Firebase
  (gratuit mais ne répond pas à l'exigence Sheets).
- **Conséquences** : quotas Apps Script, latence 1–3 s, CORS à traiter, déploiement manuel du
  backend.

### D-004 — Aucune authentification utilisateur

- **Statut** : accepté (exigence produit)
- **Date** : 2026-11-02
- **Décision** : lecture et ajout publics, sans compte.
- **Conséquences** : protection par Turnstile, validation serveur, rate limit, modération
  éventuelle.

### D-005 — Cloudflare Turnstile sur les écritures

- **Statut** : proposé
- **Date** : 2026-11-02
- **Décision** : widget Turnstile côté client, vérification `siteverify` côté Apps Script.
- **Conséquences** : dépendance à Cloudflare (gratuit), jeton à usage unique, domaine à déclarer.

### D-006 — PWA proposée dans le menu Réglages

- **Statut** : accepté (exigence produit)
- **Date** : 2026-11-02
- **Décision** : aucune bannière automatique ; entrée « Installer l'application » dans Réglages,
  instructions dédiées iOS.
- **Conséquences** : détection `display-mode`, gestion du report de `beforeinstallprompt`.

### D-007 — Gratuité totale

- **Statut** : accepté (exigence produit)
- **Date** : 2026-11-02
- **Décision** : toute techno doit rester gratuite à l'usage (pas d'essai, pas de quota qui
  expire).
- **Conséquences** : pas de service managé payant, vigilance sur les quotas.

### D-008 — Documentation lisible par les agents IA

- **Statut** : accepté
- **Date** : 2026-11-02
- **Décision** : `AGENTS.md` + `docs/` structurés, règles impératives, protocole « demander
  avant », journal de décisions.
- **Conséquences** : la doc fait partie de la définition de « terminé ».

### D-009 — Publication immédiate des ajouts

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : un jeu ajouté est publié immédiatement (`statut = publie`), sans file de
  modération.
- **Alternatives** : `en_attente` + validation manuelle (plus sûr, plus de travail) ; publication
  - bouton de signalement (fonctionnalité supplémentaire).
- **Conséquences** : Turnstile, honeypot, validation et rate limit sont la seule barrière. Le
  propriétaire supprime manuellement une ligne indésirable. Pas d'écran d'administration en v1.

### D-010 — Pas d'écran d'administration en v1

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : la modération se fait directement dans Google Sheets.
- **Conséquences** : aucun rôle, aucun mot de passe, aucune surface d'attaque supplémentaire.
  Un écran protégé pourra être étudié plus tard (nouvelle décision).

### D-011 — Routage par HashRouter

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : `react-router` en `HashRouter` (URLs `/#/reglages`).
- **Alternatives** : `BrowserRouter` + `404.html` (URLs propres, plus fragile sur Pages) ;
  routeur maison (zéro dépendance, à maintenir).
- **Conséquences** : nouvelle dépendance `react-router` (~15 kB gzip), aucune configuration
  serveur, fonctionne avec n'importe quel `base`.

### D-012 — CSS natif + variables

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : CSS natif, design tokens en variables CSS, BEM simplifié.
- **Alternatives** : CSS Modules (isolation, plus verbeux) ; Tailwind (dépendance, éloigne des
  valeurs exactes de la maquette).
- **Conséquences** : zéro dépendance de style, fidélité maximale à la maquette, discipline de
  nommage nécessaire.

### D-013 — Lecture runtime via Apps Script

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : la liste des jeux, les critères et leurs options sont lus à l'exécution via le
  Web App Apps Script (cache 5 min). Aucune donnée codée en dur.
- **Alternatives** : lecture directe d'une feuille publiée (plus rapide, feuille publique).
- **Conséquences** : une seule API, validation, feuille non publiée, latence 1–3 s.

### D-014 — Quatre feuilles normalisées

- **Statut** : remplacé par [D-018](#d-018--deux-onglets-directs-jeux-et-criteres)
- **Date** : 2026-10-29
- **Décision** : `Jeux`, `Criteres`, `Options`, `JeuxCriteres` (table de liaison).
- **Conséquences** : critères et options dynamiques, éditables dans la feuille sans redéploiement.

### D-015 — Édition publique

- **Statut** : accepté (risque assumé)
- **Date** : 2026-10-29
- **Décision** : tout visiteur peut ajouter et modifier un jeu ainsi qu'ajouter des options. Pas
  d'écran d'administration.
- **Conséquences** : Turnstile, honeypot, validation et rate limit (20 écritures/h/IP) sont la
  seule barrière. Le propriétaire supprime manuellement une ligne indésirable. Risque de
  vandalisme à surveiller.

### D-016 — Navigation mobile par barre d'onglets

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : barre d'onglets basse « Jeux / Filtres / Liste » sur mobile.
- **Conséquences** : trois vues distinctes, filtres conservés en mémoire de session.

### D-017 — Bouton « Enregistrer » et « Nouveau jeu »

- **Statut** : accepté (écart validé)
- **Date** : 2026-10-29
- **Décision** : le formulaire d'édition reçoit un bouton « Enregistrer » dans l'en-tête et la
  liste reçoit un bouton « Nouveau jeu », absents de la maquette mais indispensables.
- **Conséquences** : écart documenté, à reverdir si la maquette finale les inclut.

### D-018 — Deux onglets directs (`jeux` et `criteres`)

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : le document Google Sheets est structuré en 2 onglets : `jeux` (chaque ligne = un jeu avec colonnes Nom, Site, critères avec listes déroulantes multi-sélection) et `criteres` (chaque colonne = un critère, options listées en dessous).
- **Conséquences** : édition manuelle native et directe dans Google Sheets simplifiée pour l'utilisateur, Apps Script effectue la conversion vers le contrat d'API de l'application.

### D-019 — Onglets verticaux fixes aux extrémités (Filtres à gauche, Liste des jeux à droite)

- **Statut** : remplacé par [D-021](#d-021--système-de-volets-coulissants-avec-barre-donglets-mobile-et-en-tête-permanent)
- **Date** : 2026-10-29
- **Décision** : sur desktop, les deux onglets verticaux (« Filtres » jaune à gauche et « Liste des jeux » bleu à droite) restent toujours visibles en permanence. Le volet de contenu coulisse horizontalement entre les deux sans jamais les recouvrir.
- **Conséquences** : remplacé par D-021 pour placer les deux onglets ensemble (à droite en vue Filtres, à gauche en vue Liste des jeux).

### D-020 — Affichage unifié en « empilement de livres » pour résultats et base de données

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : les résultats de filtres (HomePage) et la liste de la base de données (DatabasePage) partagent le même composant `GameCard` et la même présentation façon tranches de livres empilés (`.book-stack`). Chaque élément présente un fond sombre, un liseré coloré correspondant à sa catégorie à gauche, un losange décoratif `◆`, un bouton d'édition `i`, ainsi qu'une rotation (±1.2°) et un décalage horizontal (±6px) pseudo-aléatoires déterministes basés sur l'ID du jeu. Au survol, le livre se soulève de la pile.
- **Conséquences** : harmonisation visuelle complète entre les deux vues, identité ludique renforcée, stabilité visuelle sans tremblement au rechargement.

### D-021 — Système de volets coulissants avec barre d'onglets mobile et en-tête permanent

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : l'en-tête « La Ludothèque / Le répertoire des jeux pédagogiques » et le bouton réglages restent toujours visibles au sommet de la carte. En dessous, un rail coulissant regroupe les deux colonnes d'onglets (jaune « Filtres » et bleu « Liste des jeux ») : en vue Filtres, la barre des 2 onglets est calée à droite ; en vue Liste des jeux, la barre des 2 onglets est calée à gauche. L'onglet actif est fortement accentué (opacité 1, bordure intérieure marquée, typographie grasse) et l'onglet inactif est estompé (opacité 0.42). Sur mobile, la barre basse `BottomNav` commute directement les vues.
- **Conséquences** : métaphore physique de volet coulissant très intuitive, repère visuel permanent grâce au titre fixe.

### D-022 — Rangement compact des filtres (limité au premier quart de l'écran)

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : la zone de filtres est condensée dans un conteneur dédié borné au premier quart de l'écran (`max-height: 25%`) avec défilement interne si nécessaire. Chaque ligne de critère associe de manière compacte son libellé (avec badge de sélection) et ses pastilles réduites (26px de hauteur). Les 75% restants de l'écran sont pleinement dédiés à l'affichage des jeux compatibles dans l'empilement de livres.
- **Conséquences** : lisibilité maximale des filtres sans empiéter sur l'espace d'affichage des jeux.

### D-023 — Icône officielle de l'application et PWA

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** : adoption de l'icône fournie par l'utilisateur (étagère bleue avec meeple jaune, livres, dé rouge et pièces de puzzle vert/jaune) déclinée en 512x512, 192x192, 180x180 (apple-touch-icon) et favicon 48x48.
- **Conséquences** : identité graphique complète pour l'installation sur mobile/desktop et onglets de navigation.

### D-024 — Typographie uniforme, suppression des barres d'accent des onglets et espacement des filtres

- **Statut** : accepté
- **Date** : 2026-10-29
- **Décision** :
  1. La même typographie sans-serif (`var(--font)`) que le titre « La Ludothèque » est appliquée partout (cartes empilées, boutons, filtres) avec variation des graisses et des tailles.
  2. Suppression des petites barres d'accent (noire sur l'onglet Filtres et blanche sur Liste des jeux) produites par les ombres `inset`.
  3. Intitulés de filtres non tronqués (`white-space: nowrap`), séparation nette entre chaque rangée de critères (`border-bottom: 1px solid var(--c-line)`) et espacement élargi des puces.
  4. Animation dynamique au survol des cartes-livres : légère rotation accentuée (`rotate(...)`), agrandissement (`scale(1.03)`), élévation de 4px et ombre portée renforcée avec courbe de transition rebondissante (`cubic-bezier(0.34, 1.45, 0.64, 1)`).
- **Conséquences** : harmonie typographique parfaite, suppression des artefacts visuels sur les volets, clarté accrue des critères de filtrage et retour tactile/ludique au survol des jeux.

## Questions ouvertes

| #   | Question                                                           | Impact                   | Bloquant         |
| --- | ------------------------------------------------------------------ | ------------------------ | ---------------- |
| Q5  | Images des jeux : URL externe uniquement ou upload ?               | Stockage, coût, sécurité | Non (v1 = URL)   |
| Q6  | Wireframes + maquette + références de style (reçu : maquette HTML) | Toute l'UI               | Oui (phase 1)    |
| Q8  | Faut-il un Cloudflare Worker en proxy devant Apps Script ?         | CORS, robustesse         | Non (si CORS OK) |
| Q9  | Emplacement/forme de la notification de mise à jour PWA            | Maquette                 | Non (phase 5)    |
| Q10 | Filtres exacts et leurs libellés                                   | Maquette, produit        | Oui (phase 1)    |
| Q11 | Style final (palette, typographie) — maquette provisoire           | Visuel                   | Oui (phase 1)    |
| Q12 | Suppression d'un jeu ou d'une option depuis l'interface ?          | Périmètre                | Non (v1 = non)   |
| Q13 | Historique des modifications en cas de vandalisme ?                | Traçabilité              | Non (v1 = non)   |

### Tranchées

| #   | Question                                              | Décision                   |
| --- | ----------------------------------------------------- | -------------------------- |
| Q1  | Statut par défaut d'un ajout                          | D-009                      |
| Q2  | Écran d'administration                                | D-010                      |
| Q3  | Routage                                               | D-011                      |
| Q4  | Approche CSS                                          | D-012                      |
| Q7  | Nom et contact de l'éditeur pour les mentions légales | Olivier Sud / Dépôt GitHub |
| Q13 | Lecture runtime                                       | D-013                      |
| Q14 | Quatre feuilles                                       | D-014                      |
| Q15 | Édition publique                                      | D-015                      |
| Q16 | Navigation mobile                                     | D-016                      |
| Q17 | Boutons Enregistrer/Nouveau                           | D-017                      |

## Modèle pour une nouvelle décision

```md
### D-XXX — Titre court

- **Statut** : proposé | accepté | remplacé par D-YYY | abandonné
- **Date** : AAAA-MM-JJ
- **Contexte** : pourquoi la question se pose
- **Décision** : ce qui est retenu
- **Alternatives** : ce qui a été écarté et pourquoi
- **Conséquences** : impacts techniques, coûts, risques
```
