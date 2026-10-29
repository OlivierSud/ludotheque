# PWA

## Principe

L'application est une PWA installable, mais **l'installation est proposée dans le menu
Réglages** — jamais via une bannière automatique, un pop-up intempestif ou un bandeau flottant.

## Comportement attendu

### Entrée « Installer l'application »

Dans **Réglages** :

| Situation                                 | Affichage                                                      |
| ----------------------------------------- | -------------------------------------------------------------- |
| Navigateur compatible, non installée      | Bouton « Installer l'application » → déclenche le prompt natif |
| Application déjà installée (`standalone`) | Entrée masquée, ou mention « Application installée »           |
| iOS / iPadOS (Safari)                     | Instructions : « Partager → Sur l'écran d'accueil »            |
| Navigateur non compatible                 | Entrée masquée ou message explicatif                           |

Règles :

- Détection d'installation : `window.matchMedia('(display-mode: standalone)').matches` **ou**
  `navigator.standalone === true` (iOS).
- Le prompt natif n'est utilisable qu'une fois et seulement après `beforeinstallprompt` : stocker
  l'événement, ne le déclencher qu'au clic.
- Ne jamais appeler `prompt()` au chargement de la page.
- Aucune modale d'installation à l'ouverture.

### Hors ligne

- Le service worker précache la coquille (HTML, CSS, JS, icônes).
- Les lectures d'API passent en `NetworkFirst` avec repli sur le cache (données du dernier
  chargement réussi).
- L'ajout d'un jeu **nécessite** le réseau : afficher un message clair si hors ligne.
- Les filtres et la recherche fonctionnent sur les données en cache.

### Mise à jour

- `registerType: 'prompt'` : pas de rechargement silencieux.
- Une notification de mise à jour est **à valider avec la maquette** (emplacement, forme).
- Tant qu'elle n'est pas validée, ne pas afficher de bannière : l'utilisateur recharge simplement.

## Configuration technique

| Fichier                       | Rôle                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| `vite.config.ts`              | `manifest`, `workbox`, `registerType`, `injectRegister: false` |
| `src/vite-env.d.ts`           | types de `virtual:pwa-register`                                |
| `public/icons/*`              | icônes 192 / 512 / maskable                                    |
| `public/apple-touch-icon.png` | icône iOS (180 px, opaque)                                     |

`injectRegister: false` : l'enregistrement est fait dans `src/main.tsx` pour maîtriser le moment
et le comportement.

```ts
// src/main.tsx
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });
```

## Icônes

- Remplacer les icônes provisoires par celles de la charte graphique.
- `maskable` : contenu dans les 80 % centraux (zone de sécurité Android).
- `apple-touch-icon` : fond opaque, pas de transparence.
- Vérifier le rendu sur Android (mask) et iOS (coins arrondis automatiques).

## Règles

1. Ne jamais éditer `dist/sw.js` ni `manifest.webmanifest` : générés au build.
2. Toute nouvelle ressource statique doit être couverte par `workbox.globPatterns` ou une règle
   `runtimeCaching`.
3. `start_url` et `scope` doivent rester alignés sur `base` (voir `deployment.md`).
4. Tester **en `preview`** (le service worker est inactif en `dev`).
5. Ne pas changer la stratégie de cache sans validation (impact hors-ligne et fraîcheur).

## Procédure de test

1. `start-local preview` → `http://localhost:4173/ludotheque/`.
2. DevTools → Application → Manifest : aucune erreur, icônes présentes.
3. Application → Service Workers : statut « activated and is running ».
4. Réglages → « Installer l'application » → le prompt natif s'ouvre.
5. Cocher « Offline » → recharger : la liste s'affiche depuis le cache.
6. Tenter un ajout hors ligne : message d'erreur explicite, aucune perte de saisie.
7. Déployer une nouvelle version : vérifier le comportement de mise à jour retenu.

## Limites connues

- iOS : pas de `beforeinstallprompt`, installation manuelle uniquement.
- Pas de notifications push ni de synchronisation en arrière-plan.
- Le service worker ne fonctionne pas sur `file://` : toujours passer par le serveur local.
