/// <reference types="vite/client" />

import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Nom du dépôt GitHub. Sert à construire le `base` de l'application, car
 * GitHub Pages sert le site depuis https://<user>.github.io/<repo>/.
 * En CI, `VITE_BASE_PATH` est injecté par le workflow (voir docs/deployment.md).
 */
const REPO_NAME = 'ludotheque';
const base = process.env.VITE_BASE_PATH ?? `/${REPO_NAME}/`;

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      // L'enregistrement sera fait dans l'application via `virtual:pwa-register`
      // (voir docs/pwa.md) pour maîtriser la bannière de mise à jour.
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'La Ludothèque',
        short_name: 'Ludothèque',
        description: 'Le répertoire des jeux pédagogiques.',
        lang: 'fr',
        dir: 'ltr',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#005b9f',
        background_color: '#f8f8f8',
        start_url: base,
        scope: base,
        categories: ['games', 'entertainment', 'lifestyle'],
        icons: [
          {
            src: `${base}icons/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}icons/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${base}icons/maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/script\.google\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ludotheque-api',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }) as PluginOption,
  ],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    sourcemap: true,
  },
});
