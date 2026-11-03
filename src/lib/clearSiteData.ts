const APP_KEY_PREFIX = 'ludotheque:';

function clearAppStorage(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key !== null && key.startsWith(APP_KEY_PREFIX)) keys.push(key);
    }
    for (const key of keys) window.localStorage.removeItem(key);
  } catch {
    // Stockage indisponible (navigation privée stricte) : rien à vider.
  }
}

async function clearBrowserCaches(): Promise<void> {
  if (typeof caches === 'undefined') return;
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
}

async function unregisterServiceWorkers(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
}

/**
 * Vide les données locales de l'application (préfixe `ludotheque:`), les caches du
 * navigateur et les service workers. L'appelant recharge ensuite la page.
 */
export async function clearSiteData(): Promise<void> {
  clearAppStorage();
  await Promise.allSettled([clearBrowserCaches(), unregisterServiceWorkers()]);
}
