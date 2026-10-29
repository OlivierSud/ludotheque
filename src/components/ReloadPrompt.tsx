import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Affiche une bannière lorsqu'une nouvelle version de l'application est
 * disponible (ou que le mode hors ligne est prêt).
 */
export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration !== undefined) {
        // Vérifie les mises à jour toutes les heures.
        window.setInterval(() => void registration.update(), 60 * 60 * 1000);
      }
      if (import.meta.env.DEV) {
        console.warn(`Service worker enregistré : ${swUrl}`);
      }
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="toast" role="status" aria-live="polite">
      <p>
        {needRefresh
          ? 'Une nouvelle version est disponible.'
          : 'Application prête à être utilisée hors ligne.'}
      </p>
      <div className="toast__actions">
        {needRefresh && (
          <button
            type="button"
            className="button button--primary"
            onClick={() => void updateServiceWorker(true)}
          >
            Mettre à jour
          </button>
        )}
        <button type="button" className="button" onClick={close}>
          Fermer
        </button>
      </div>
    </div>
  );
}
