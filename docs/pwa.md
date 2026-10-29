# PWA (Progressive Web App)

## Ce qui est en place

- **Manifest** généré au build par `vite-plugin-pwa` (config dans `vite.config.ts`).
- **Service worker Workbox** (`generateSW`) avec précache de tous les fichiers produits.
- **Icônes** : 192 px, 512 px et une variante `maskable`.
- **Bannière de mise à jour** (`src/components/ReloadPrompt.tsx`) via
  `virtual:pwa-register/react`.
- **Mode hors ligne** : la coquille de l'application et les données embarquées sont servies
  depuis le cache.

## Fichiers concernés

| Fichier                           | Rôle                                                |
| --------------------------------- | --------------------------------------------------- |
| `vite.config.ts`                  | `manifest`, `workbox`, `registerType`, `devOptions` |
| `src/components/ReloadPrompt.tsx` | enregistrement du SW + notification de mise à jour  |
| `src/vite-env.d.ts`               | types des modules virtuels (`virtual:pwa-register`) |
| `public/icons/*`                  | icônes PNG                                          |
| `public/apple-touch-icon.png`     | icône iOS                                           |
| `scripts/generate-icons.ps1`      | régénération des icônes                             |

## Règles

1. **Ne jamais éditer `dist/sw.js`** : il est généré. Toute modification se fait dans
   `vite.config.ts`.
2. **Toute nouvelle ressource statique** (police, image, JSON) doit être couverte par
   `workbox.globPatterns` ou par une règle `runtimeCaching` si elle est volumineuse/externe.
3. **`registerType: 'prompt'`** : on ne recharge pas l'application dans le dos de l'utilisateur.
   Toute nouvelle version passe par la bannière « Mettre à jour ».
4. **Tester en `preview`**, jamais en `dev` (le SW est désactivé en développement).
5. **Le mode hors ligne est un critère de recette** : couper le réseau et vérifier que la liste
   s'affiche et que les favoris fonctionnent.
6. **Ne pas changer `start_url` / `scope`** sans mettre à jour `base` : les deux doivent rester
   cohérents avec le chemin de déploiement.

## Icônes

Le motif est défini dans `scripts/generate-icons.ps1` (et `public/favicon.svg` pour le vecteur).
Pour régénérer après un changement de charte :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-icons.ps1
```

Contraintes :

- `icon-192.png` et `icon-512.png` : fond arrondi, coins transparents.
- `maskable-512.png` : fond plein, contenu dans les 80 % centraux (zone de sécurité Android).
- `apple-touch-icon.png` (180 px) : pas de transparence, iOS applique son propre arrondi.

## Mise à jour du service worker

- `cleanupOutdatedCaches: true` supprime les anciens caches.
- Le SW vérifie les mises à jour toutes les heures (`onRegisteredSW` dans `ReloadPrompt`).
- Après déploiement, un utilisateur déjà installé voit la bannière au prochain chargement.
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
- Les données vivent dans `localStorage` : pas de synchronisation entre appareils.
- Sur iOS, l'installation passe par « Partager → Sur l'écran d'accueil ».
