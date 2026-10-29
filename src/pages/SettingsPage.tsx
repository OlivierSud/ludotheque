import { useNavigate } from 'react-router-dom';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function SettingsPage() {
  const navigate = useNavigate();
  const { canInstall, installed, isIos, install } = useInstallPrompt();

  return (
    <div className="screen__inner">
      <header className="page-header">
        <button type="button" className="back-button" onClick={() => navigate('/')}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h1 className="page-title">Réglages</h1>
        <span className="form-header__spacer" />
      </header>

      <section className="settings-section">
        <h2 className="settings-section__title">Application</h2>
        <div className="settings-row">
          <div>
            <p className="settings-row__label">Installer l'application</p>
            <p className="settings-row__hint">
              {installed
                ? "L'application est déjà installée."
                : isIos
                  ? "Sur iOS : Partager → Sur l'écran d'accueil."
                  : canInstall
                    ? "Ajoute un raccourci sur l'écran d'accueil."
                    : 'Installation indisponible sur ce navigateur.'}
            </p>
          </div>
          {canInstall && !installed && (
            <button type="button" className="primary-button" onClick={() => void install()}>
              Installer
            </button>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">Informations légales</h2>
        <div className="settings-row">
          <span className="settings-row__label">Mentions légales</span>
          <a className="secondary-button" href="#/mentions-legales">
            Ouvrir
          </a>
        </div>
        <div className="settings-row">
          <span className="settings-row__label">Confidentialité</span>
          <a className="secondary-button" href="#/confidentialite">
            Ouvrir
          </a>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">Version</h2>
        <div className="settings-row">
          <span className="settings-row__label">Ludothèque</span>
          <span className="settings-row__hint">v{__APP_VERSION__}</span>
        </div>
      </section>
    </div>
  );
}
