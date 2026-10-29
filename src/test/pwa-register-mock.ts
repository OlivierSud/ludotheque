import { useState } from 'react';

/**
 * Doublure du hook `virtual:pwa-register/react` utilisée uniquement dans les
 * tests (Vitest ne peut pas résoudre les modules virtuels du plugin PWA).
 */
export function useRegisterSW() {
  return {
    offlineReady: useState(false),
    needRefresh: useState(false),
    updateServiceWorker: async () => undefined,
  };
}
