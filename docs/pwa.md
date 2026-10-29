# PWA (Progressive Web App)

## État actuel

Le socle PWA est **configuré et fonctionnel** :

- **Manifest** généré au build par `vite-plugin-pwa` (config dans `vite.config.ts`).
- **Service worker Workbox** (`generateSW`) avec précache de tous les fichiers produits.
- **Icônes** : 192 px, 512 px et une variante `maskable` (provisoires, voir plus bas).
- **Pas encore d'interface** : l'enregistrement du service worker et la bannière de mise à jour
  seront branchés avec le code applicatif (voir « Enregistrement du service worker »).

## Fichiers concernés

| Fichier                       | Rôle                                                |
| ----------------------------- | --------------------------------------------------- |
| `vite.config.ts`              | `manifest`, `workbox`, `registerType`, `devOptions` |
| `src/vite-env.d.ts`           | types des modules virtuels (`virtual:pwa-register`) |
| `public/icons/*`              | icônes PNG provisoires                              |
| `public/apple-touch-icon.png` | icône iOS provisoire                                |
| `public/favicon.svg`          | favicon provisoire                                  |
| `index.html`                  | `theme-color`, `favicon`, `apple-touch-icon`        |

## Règles

1. **Ne jamais éditer `dist/sw.js`** : il est généré. Toute modification se fait dans
   `vite.config.ts`.
2. **Toute nouvelle ressource statique** (police, image, JSON) doit être couverte par
   `workbox.globPatterns` ou par une règle `runtimeCaching` si elle est volumineuse/externe.
3. **`registerType: 'prompt'`** : on ne recharge pas l'application dans le dos de l'utilisateur.
   Toute nouvelle version passe par une bannière « Mettre à jour ».
4. **`injectRegister: false`** : le service worker n'est pas enregistré automatiquement par le
   build. L'enregistrement se fait dans l'application (voir ci-dessous), ce qui évite un double
   enregistrement et permet de piloter la bannière.
5. **Tester en `preview`**, jamais en `dev` (le SW est désactivé en développement).
6. **Le mode hors ligne est un critère de recette** : couper le réseau et vérifier que
   l'application reste utilisable.
7. **Ne pas changer `start_url` / `scope`** sans mettre à jour `base` : les deux doivent rester
   cohérents avec le chemin de déploiement.

## Enregistrement du service worker

À faire au moment de créer `src/main.tsx` :

```tsx
import { useRegisterSW } from 'virtual:pwa-register/react';

const {
  offlineReady: [offlineReady, setOfflineReady],
  needRefresh: [needRefresh, setNeedRefresh],
  updateServiceWorker,
} = useRegisterSW();
```

Afficher une bannière lorsque `needRefresh` est vrai, avec un bouton qui appelle
`updateServiceWorker(true)`. `src/vite-env.d.ts` fournit déjà les types de `virtual:pwa-register`.

## Icônes

Les icônes actuelles sont **provisoires** et doivent être remplacées par celles de la charte
graphique dès que la maquette est disponible.

Contraintes de format :

- `icons/icon-192.png` et `icons/icon-512.png` : coins arrondis, transparence autorisée.
- `icons/maskable-512.png` : fond plein, contenu dans les 80 % centraux (zone de sécurité Android).
- `apple-touch-icon.png` (180 px) : pas de transparence, iOS applique son propre arrondi.
- `favicon.svg` : vecteur, fond opaque.

Après remplacement, mettre à jour `manifest.icons` dans `vite.config.ts` si les noms changent.

## Mise à jour du service worker

- `cleanupOutdatedCaches: true` supprime les anciens caches.
- Ajouter dans l'application une vérification périodique des mises à jour :
  ```ts
  useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) window.setInterval(() => void registration.update(), 60 * 60 * 1000);
    },
  });
  ```
- En cas de comportement étrange après un changement de config : DevTools → Application →
  « Update on reload » puis « Unregister ».

## Ajouter du cache runtime (API, images distantes)

```ts
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.example\.com\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
  ],
}
```

Stratégies : `NetworkFirst` (données fraîches, repli cache), `CacheFirst` (assets immuables),
`StaleWhileRevalidate` (compromis).

## Limites connues

- Pas de notifications push ni de synchronisation en arrière-plan (nécessiterait un backend).
- Sur iOS, l'installation passe par « Partager → Sur l'écran d'accueil ».
