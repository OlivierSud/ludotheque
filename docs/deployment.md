# Déploiement

## Vue d'ensemble

| Composant | Où                           | Déclencheur                  |
| --------- | ---------------------------- | ---------------------------- |
| Frontend  | GitHub Pages                 | push sur `main` (workflow)   |
| Backend   | Google Apps Script (Web App) | déploiement manuel (éditeur) |
| Données   | Google Sheets                | via Apps Script uniquement   |
| Anti-bot  | Cloudflare Turnstile         | configuration manuelle       |

## Frontend — GitHub Pages

Workflow `.github/workflows/deploy.yml` : `npm ci` → lint → typecheck → test → build → publication
via OIDC.

### Activation initiale (une fois)

1. **Settings → Pages → Source : GitHub Actions**.
2. **Settings → Environments → `github-pages`** : autoriser `main`.
3. Pousser sur `main`.
4. (Recommandé) Protéger `main` : PR obligatoire + CI verte.

URL : `https://oliviersud.github.io/ludotheque/`.

### Le `base` path

```ts
const base = process.env.VITE_BASE_PATH ?? '/ludotheque/';
```

| Contexte                                  | `VITE_BASE_PATH` |
| ----------------------------------------- | ---------------- |
| Dépôt projet                              | `/ludotheque/`   |
| Domaine personnalisé / `<user>.github.io` | `/`              |

En CI, la valeur est calculée depuis le nom du dépôt. Surcharge possible via
**Settings → Secrets and variables → Actions → Variables** (`VITE_BASE_PATH`).

Conséquences :

- Jamais de chemin absolu codé en dur : utiliser `import.meta.env.BASE_URL`.
- `start_url` et `scope` du manifest suivent `base`.
- Liens internes : inclure le base ou configurer le routeur avec `basename`.

## Variables et secrets

### Variables GitHub (publiques, injectées au build)

| Nom                       | Exemple                                     |
| ------------------------- | ------------------------------------------- |
| `VITE_API_URL`            | `https://script.google.com/macros/s/…/exec` |
| `VITE_TURNSTILE_SITE_KEY` | `0x4AAA…`                                   |
| `VITE_BASE_PATH`          | `/ludotheque/` (optionnel)                  |

Les valeurs `VITE_*` finissent **dans le bundle** : ne jamais y mettre un secret.

### Secrets

| Nom                | Où                               |
| ------------------ | -------------------------------- |
| `TURNSTILE_SECRET` | Propriétés du script Apps Script |
| `SHEET_ID`         | Propriétés du script Apps Script |

### Local

Créer `.env.local` (ignoré par Git) :

```dotenv
VITE_API_URL=https://script.google.com/macros/s/…/exec
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Fournir un `.env.example` sans valeur réelle.

## Backend — Apps Script

1. Ouvrir la feuille → `Extensions → Apps Script`.
2. Coller les fichiers de `backend/apps-script/`.
3. Renseigner les propriétés du script (`TURNSTILE_SECRET`, `SHEET_ID`, `ALLOWED_ORIGINS`).
4. `Déployer → Nouveau déploiement → Application web` :
   - Exécuter en tant que : **moi**
   - Qui a accès : **tout le monde**
5. Copier l'URL `/exec`.
6. Après chaque modification : `Gérer les déploiements → Modifier → Nouvelle version`.

> L'URL `/exec` est publique par nature. La protection repose sur Turnstile, la validation et le
> rate limit — pas sur le secret de l'URL.

## Cloudflare Turnstile

1. Dashboard Cloudflare → Turnstile → `Add site`.
2. Domaines : `oliviersud.github.io` + `localhost`.
3. Mode **Managed**.
4. Site Key → `VITE_TURNSTILE_SITE_KEY` ; Secret Key → `TURNSTILE_SECRET` (Apps Script).
5. Vérifier dans le dashboard que les requêtes arrivent (taux de succès).

## Domaines et HTTPS

- GitHub Pages fournit HTTPS automatiquement.
- Domaine personnalisé : `public/CNAME`, DNS `CNAME` vers `<user>.github.io`, `VITE_BASE_PATH=/`.
- Turnstile : ajouter le domaine personnalisé à la liste autorisée.

## Rollback

- Frontend : `git revert <sha>` sur `main` puis push (redéploiement automatique).
- Backend : `Gérer les déploiements` → sélectionner une version antérieure → redéployer.
- Données : restaurer une copie de la feuille (sauvegarde manuelle).

## Dépannage

| Symptôme                             | Cause probable                               | Solution                                         |
| ------------------------------------ | -------------------------------------------- | ------------------------------------------------ |
| Page blanche, 404 sur `/assets/*`    | `base` incorrect                             | Vérifier `VITE_BASE_PATH` et le nom du dépôt     |
| Ancienne version affichée            | Service worker en cache                      | Attendre, ou DevTools → Unregister + hard reload |
| `configure-pages` échoue             | Pages non activé en « GitHub Actions »       | Settings → Pages → Source                        |
| `npm ci` échoue en CI                | Lockfile absent/désynchronisé                | `npm install` en local + commit                  |
| Erreur CORS sur POST                 | Preflight `OPTIONS` non géré par Apps Script | POST en `text/plain`, ou Worker proxy            |
| `{ ok:false, error:"captcha" }`      | Site key/secret erronés, domaine absent      | Vérifier les deux clés et les domaines Turnstile |
| `{ ok:false, error:"rate_limited" }` | Plus de 5 ajouts/heure                       | Attendre, ou ajuster le seuil (avec validation)  |
| Données absentes                     | `statut != publie` ou cache 5 min            | Vérifier la colonne `statut`, vider le cache     |
| Quota Apps Script dépassé            | Trop d'appels `UrlFetch`/jour                | Réduire les appels, augmenter le cache           |

## Checklist de mise en production

- [ ] CI verte sur `main`
- [ ] Variables GitHub renseignées
- [ ] Secret Turnstile uniquement dans Apps Script
- [ ] Déploiement Apps Script à jour (nouvelle version)
- [ ] Manifest et `sw.js` accessibles en production
- [ ] Test d'ajout réel réussi
- [ ] Mentions légales et confidentialité en ligne
- [ ] Rollback testé (au moins une fois)
