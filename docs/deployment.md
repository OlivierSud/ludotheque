# Déploiement — GitHub Pages

## Fonctionnement

Le workflow `.github/workflows/deploy.yml` :

1. se déclenche sur `push` vers `main` (ou manuellement via _Run workflow_) ;
2. installe les dépendances (`npm ci`), lance lint, types et tests ;
3. construit l'application avec le bon chemin de base ;
4. publie `dist/` sur GitHub Pages via OIDC (aucun token à stocker).

L'URL de production est `https://<utilisateur>.github.io/<dépôt>/`, ici :
**https://oliviersud.github.io/ludotheque/**

## Configuration initiale (une seule fois)

1. **Settings → Pages → Build and deployment → Source : GitHub Actions.**
2. **Settings → Environments → `github-pages`** : vérifier que la branche `main` est autorisée.
3. Pousser sur `main` : le premier déploiement crée l'environnement automatiquement.
4. (Recommandé) **Settings → Branches → protection de `main`** : PR obligatoire + CI verte.

## Le `base` path

GitHub Pages sert un dépôt projet depuis un sous-dossier : tous les assets doivent être
préfixés. C'est le rôle de `base` dans `vite.config.ts` :

```ts
const base = process.env.VITE_BASE_PATH ?? '/ludotheque/';
```

| Contexte                                   | `VITE_BASE_PATH`                   |
| ------------------------------------------ | ---------------------------------- |
| Dépôt projet (`/<dépôt>/`)                 | `/ludotheque/`                     |
| Domaine personnalisé ou `<user>.github.io` | `/`                                |
| Développement local                        | `/ludotheque/` (valeur par défaut) |

En CI, le chemin est calculé automatiquement à partir du nom du dépôt. Pour le surcharger sans
toucher au code :

> **Settings → Secrets and variables → Actions → Variables → New repository variable**
> `VITE_BASE_PATH` = `/`

### Conséquences à respecter

- **Ne jamais** coder un chemin absolu en dur (`/images/...`) : utiliser `import.meta.env.BASE_URL`
  ou une URL relative au manifest.
- Les liens internes doivent inclure le base (ou passer par un routeur configuré avec `basename`).
- Le `start_url` et le `scope` du manifest sont construits à partir de `base` : ne pas les
  dissocier.

## Routage côté client

Aucun routage n'est en place pour l'instant. `public/404.html` redirige simplement toute URL
inconnue vers la racine du site.

Si un routeur `BrowserRouter` est ajouté, remplacer ce fichier par la technique
« spa-github-pages » :

1. `public/404.html` encode le chemin demandé puis redirige vers `index.html`.
2. `index.html` (script inline) restaure l'URL d'origine avant le chargement de React.
3. Ajouter `basename={import.meta.env.BASE_URL}` au routeur.

Alternative plus simple : `HashRouter` (`/#/jeux/azul`), qui ne nécessite aucune configuration
serveur.

## Domaine personnalisé

1. Créer `public/CNAME` contenant le domaine (`ludotheque.example.com`).
2. Configurer le DNS : `CNAME` vers `<utilisateur>.github.io`.
3. Settings → Pages → renseigner le domaine, activer _Enforce HTTPS_.
4. Définir la variable `VITE_BASE_PATH` à `/` et redéployer.

## Déploiement manuel / rollback

- **Redéployer** : Actions → « Déploiement GitHub Pages » → _Run workflow_.
- **Rollback** : `git revert <sha>` sur `main` puis push (le workflow republie l'état précédent).
  Éviter de réécrire l'historique de `main`.

## Dépannage

| Symptôme                                    | Cause probable                              | Solution                                                     |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Page blanche, erreurs 404 sur `/assets/*`   | `base` incorrect                            | Vérifier `VITE_BASE_PATH` et le nom du dépôt                 |
| CSS/JS chargés mais application vide        | `index.html` non servi à la racine du base  | Vérifier `start_url` / redirection `404.html`                |
| Ancienne version affichée                   | Service worker en cache                     | Attendre la bannière, ou DevTools → Unregister + hard reload |
| `configure-pages` échoue                    | Pages non activé en « GitHub Actions »      | Settings → Pages → Source : GitHub Actions                   |
| `npm ci` échoue en CI                       | `package-lock.json` absent ou désynchronisé | `npm install` en local puis commit du lockfile               |
| Déploiement bloqué « waiting for approval » | Environnement protégé                       | Approuver dans l'onglet Actions ou assouplir la règle        |

## Vérifications après déploiement

- [ ] L'URL de production affiche la ludothèque
- [ ] Le manifest est accessible : `/<base>/manifest.webmanifest`
- [ ] `/<base>/sw.js` répond en 200
- [ ] Lighthouse → catégorie _PWA_ sans erreur bloquante
- [ ] Installation possible (Chrome/Edge : icône dans la barre d'adresse)
- [ ] Mode avion : rechargement OK, données persistées conservées
