import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Étendu sur window pour accéder à l'événement capturé tôt dans index.html.
declare global {
  interface Window {
    __pwaInstallEvent: BeforeInstallPromptEvent | null;
  }
}

export interface InstallPromptState {
  readonly canInstall: boolean;
  readonly installed: boolean;
  readonly isIos: boolean;
  readonly install: () => Promise<void>;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    // Récupère l'événement déjà capturé dans index.html s'il est disponible.
    () => window.__pwaInstallEvent ?? null,
  );
  const [installed, setInstalled] = useState(
    () => window.matchMedia('(display-mode: standalone)').matches,
  );

  useEffect(() => {
    // Si l'événement avait déjà été capturé globalement avant le montage,
    // on le consomme maintenant et on vide la référence globale.
    if (window.__pwaInstallEvent !== null && deferred === null) {
      setDeferred(window.__pwaInstallEvent);
      window.__pwaInstallEvent = null;
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      window.__pwaInstallEvent = null;
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      window.__pwaInstallEvent = null;
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const install = useCallback(async () => {
    if (deferred === null) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  return { canInstall: deferred !== null, installed, isIos, install };
}
