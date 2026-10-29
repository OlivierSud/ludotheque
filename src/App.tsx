import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { DataProvider } from '@/context/DataContext';
import { FiltersProvider } from '@/context/FiltersContext';
import { MobileTabBar } from '@/components/MobileTabBar';
import { HomePage } from '@/pages/HomePage';
import { FiltersPage } from '@/pages/FiltersPage';
import { DatabasePage } from '@/pages/DatabasePage';
import { GameFormPage } from '@/pages/GameFormPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LegalPage } from '@/pages/LegalPage';

const PANEL_PATHS = ['/liste', '/jeu', '/reglages', '/mentions-legales', '/confidentialite'];
const OVERLAY_PATHS = ['/reglages', '/mentions-legales', '/confidentialite'];

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPanel = PANEL_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );
  const isOverlay = OVERLAY_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  return (
    <div className="app">
      <div className="app__card">
        {/* Titre permanent toujours visible au-dessus du système de volets */}
        <header className="app__header">
          <div className="app__header-titles">
            <h1 className="page-title">La Ludothèque</h1>
            <p className="page-subtitle">Le répertoire des jeux pédagogiques</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => navigate('/reglages')}
            aria-label="Ouvrir les réglages"
            title="Réglages"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </header>

        {/* Système de volets coulissants */}
        <div className="app__track-container">
          <div className={`app__slider ${isPanel ? 'app__slider--panel' : ''}`}>
            {/* Volet 1 : Filtres & résultats */}
            <main className="app__pane app__pane--filters">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/filtres" element={<FiltersPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>

            {/* Barre centrale des deux colonnes/onglets coulissants */}
            <div className="app__tabs-bar" role="tablist" aria-label="Navigation des volets">
              <button
                type="button"
                className={`tab tab--filters ${!isPanel ? 'tab--active' : 'tab--inactive'}`}
                onClick={() => navigate('/')}
                aria-label="Afficher les filtres"
                aria-selected={!isPanel}
                role="tab"
              >
                <span className="tab__label tab__label--flat">Filtres</span>
              </button>

              <button
                type="button"
                className={`tab tab--list ${isPanel ? 'tab--active' : 'tab--inactive'}`}
                onClick={() => navigate('/liste')}
                aria-label="Afficher la liste des jeux"
                aria-selected={isPanel}
                role="tab"
              >
                <span className="tab__label">Liste des jeux</span>
              </button>
            </div>

            {/* Volet 2 : Liste des jeux, édition, etc. */}
            <div className="app__pane app__pane--database">
              <Routes>
                <Route path="/liste" element={<DatabasePage />} />
                <Route path="/jeu/:id" element={<GameFormPage />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Overlay plein écran pour Réglages et pages légales (au-dessus des onglets) */}
        {isOverlay && (
          <div className="app__overlay" aria-modal="true" role="dialog">
            <Routes>
              <Route path="/reglages" element={<SettingsPage />} />
              <Route path="/mentions-legales" element={<LegalPage kind="mentions" />} />
              <Route path="/confidentialite" element={<LegalPage kind="confidentialite" />} />
            </Routes>
          </div>
        )}
      </div>

      <MobileTabBar />
    </div>
  );
}

export function App() {
  return (
    <DataProvider>
      <FiltersProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </FiltersProvider>
    </DataProvider>
  );
}
