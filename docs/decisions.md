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

## Questions ouvertes

| #   | Question                                                                 | Impact                   | Bloquant         |
| --- | ------------------------------------------------------------------------ | ------------------------ | ---------------- |
| Q5  | Images des jeux : URL externe uniquement ou upload ?                     | Stockage, coût, sécurité | Non (v1 = URL)   |
| Q6  | Fournir les wireframes + maquette + références de style                  | Toute l'UI               | Oui (phase 1)    |
| Q7  | Nom, e-mail et éventuelle adresse de l'éditeur pour les mentions légales | Légal                    | Oui (phase 5)    |
| Q8  | Faut-il un Cloudflare Worker en proxy devant Apps Script ?               | CORS, robustesse         | Non (si CORS OK) |
| Q9  | Emplacement/forme de la notification de mise à jour PWA                  | Maquette                 | Non (phase 5)    |
| Q10 | Filtres exacts (catégorie, joueurs, durée, âge) et leurs libellés        | Maquette, produit        | Oui (phase 1)    |

### Tranchées

| #   | Question                     | Décision |
| --- | ---------------------------- | -------- |
| Q1  | Statut par défaut d'un ajout | D-009    |
| Q2  | Écran d'administration       | D-010    |
| Q3  | Routage                      | D-011    |
| Q4  | Approche CSS                 | D-012    |

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
