# Architecture

## Vue d'ensemble

Application **statique** (GitHub Pages) + **backend serverless gratuit** (Google Apps Script) +
**Google Sheets** comme base de données. Aucun serveur à administrer, aucune authentification
utilisateur.

```
┌──────────────────────────┐        ┌───────────────────────────┐
│  Navigateur (PWA)        │        │  Cloudflare Turnstile      │
│  React + Vite            │───────▶│  (widget + siteverify)     │
└────────────┬─────────────┘        └─────────────▲─────────────┘
             │ fetch (JSON)                        │ vérification
             ▼                                     │
┌──────────────────────────┐        ┌──────────────┴────────────┐
│  Google Apps Script      │───────▶│  Google Sheet "Jeux"      │
│  Web App (/exec)         │        │  (lecture / ajout)        │
└──────────────────────────┘        └───────────────────────────┘
```

- **Lecture** : l'application appelle l'API Apps Script, qui lit la feuille et renvoie du JSON.
- **Écriture** : l'application envoie le formulaire + le jeton Turnstile ; Apps Script vérifie le
  jeton, valide les données, puis ajoute la ligne.
- **Aucune clé Google n'est présente dans le bundle** : seul le secret Turnstile est stocké côté
  Apps Script (Script Properties).

## Pourquoi Apps Script (et pas l'API Sheets en direct)

| Contrainte                                   | Conséquence                                             |
| -------------------------------------------- | ------------------------------------------------------- |
| Écriture Sheets = OAuth ou compte de service | Impossible dans un site statique sans exposer un secret |
| Clé API Sheets = lecture seule + visible     | Ne permet pas l'ajout, et fuite la clé                  |
| Apps Script = gratuit, hébergé, sans serveur | Sert de proxy sécurisé et de garde-fou                  |
| Turnstile doit être vérifié côté serveur     | Apps Script fait la vérification (`UrlFetchApp`)        |

> **Décision proposée**, à confirmer dans [`decisions.md`](./decisions.md). Alternative étudiée :
> Cloudflare Worker en proxy (gratuit, 100 k req/jour) devant Apps Script — utile si CORS pose
> problème.

## Stack

| Domaine     | Choix                                    | Coût |
| ----------- | ---------------------------------------- | ---- |
| Build       | Vite 8                                   | 0 €  |
| UI          | React 19 + TypeScript strict             | 0 €  |
| Routage     | react-router en `HashRouter` (D-011)     | 0 €  |
| Styles      | CSS natif + design tokens de la maquette | 0 €  |
| PWA         | vite-plugin-pwa (Workbox)                | 0 €  |
| Routage     | react-router en `HashRouter` (D-011)     | 0 €  |
| Backend     | Google Apps Script (Web App)             | 0 €  |
| Données     | Google Sheets                            | 0 €  |
| Anti-bot    | Cloudflare Turnstile                     | 0 €  |
| Hébergement | GitHub Pages                             | 0 €  |
| Tests       | Vitest + Testing Library                 | 0 €  |
| CI/CD       | GitHub Actions                           | 0 €  |

Toute technologie ajoutée doit être **gratuite et le rester** (pas d'essai limité, pas de quota qui
expire). Vérifier les quotas avant d'adopter un service.

## Structure cible

```
.
├── backend/
│   └── apps-script/          # code collé dans l'éditeur Apps Script (versionné ici)
│       ├── Code.gs           # doGet / doPost, routage
│       ├── turnstile.gs      # vérification du jeton
│       ├── validation.gs     # validation des données
│       └── sheets.gs         # accès à la feuille
├── docs/
├── public/
├── src/
│   ├── components/           # composants présentationnels
│   ├── features/             # (optionnel) par domaine : games, settings…
│   ├── hooks/                # hooks React
│   ├── lib/                  # logique pure, sans React
│   ├── services/             # appels API, stockage local
│   ├── styles/               # tokens + styles globaux
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── index.html
├── start-local.cmd
├── update-graphify.cmd
└── vite.config.ts
```

Règle de dépendance :

```
components → lib → types
     ↓        ↑
   hooks ─────┘
     ↓
 services (réseau, stockage)
```

- `lib/` : aucune dépendance React, fonctions pures testables.
- `services/` : seule couche qui parle réseau (`fetch` vers Apps Script).
- `components/` : reçoit des props, ne fait aucun appel réseau direct.

## Flux détaillés

### Lecture de la liste

1. `services/gamesApi.ts` → `GET <API_URL>?action=list`
2. Apps Script lit la feuille (cache `CacheService` 5 min) et renvoie `{ ok, games, updatedAt }`.
3. L'application met en cache le dernier résultat (PWA / `localStorage`) pour l'hors-ligne.
4. En cas d'erreur réseau : afficher le cache + bandeau « données hors ligne ».

### Ajout d'un jeu

1. L'utilisateur remplit le formulaire ; le widget Turnstile produit un jeton.
2. `POST <API_URL>` avec `{ action: 'create', token, game, honeypot, startedAt }`.
3. Apps Script : vérifie Turnstile → valide les champs → applique le rate limit → ajoute la ligne.
4. Réponse `{ ok: true, id }` ; l'application rafraîchit la liste (ou insère le jeu en local).

Détails : [`data-google-sheet.md`](./data-google-sheet.md) et [`security.md`](./security.md).

## Environnements

| Environnement | Frontend                        | API                                |
| ------------- | ------------------------------- | ---------------------------------- |
| Local         | `start-local` (Vite, port 5173) | Même Web App Apps Script (ou test) |
| Production    | GitHub Pages                    | Web App Apps Script `/exec`        |

Variables publiques (build) :

- `VITE_API_URL` — URL du Web App Apps Script
- `VITE_TURNSTILE_SITE_KEY` — clé publique Turnstile
- `VITE_BASE_PATH` — chemin de déploiement (voir `deployment.md`)

Secrets (jamais dans le dépôt) :

- `TURNSTILE_SECRET` — Script Property Apps Script uniquement

## Décisions techniques

| Sujet     | Choix                               | Raison                                        |
| --------- | ----------------------------------- | --------------------------------------------- |
| Données   | Google Sheets                       | Demandé, gratuit, éditable manuellement       |
| Backend   | Apps Script Web App                 | Gratuit, pas de serveur, garde le secret      |
| Auth      | Aucune                              | Exigence produit                              |
| Anti-abus | Turnstile + validation + rate limit | Aucune authentification ⇒ protéger l'écriture |
| PWA       | Installation via Réglages           | Exigence produit (pas de bannière intrusive)  |
| Routage   | HashRouter (react-router)           | Aucune configuration serveur (D-011)          |

## Contraintes à surveiller

- **Quotas Apps Script** : durée d'exécution 6 min max, appels `UrlFetch` quotidiens, temps total
  par jour. Un cache de lecture est indispensable.
- **CORS** : Apps Script ne gère pas les requêtes `OPTIONS`. Envoyer les POST en `text/plain`
  (requête simple) et parser le corps côté serveur.
- **Taille de la feuille** : rester sous quelques milliers de lignes ; paginer si besoin.
- **Latence** : Apps Script peut prendre 1–3 s ; prévoir chargement et cache côté client.

## Points à valider

Voir [`decisions.md`](./decisions.md#questions-ouvertes) : Cloudflare Worker en proxy,
hébergement des images, filtres exacts.
