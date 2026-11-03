import { useLocation } from 'react-router-dom';
import { useUnsavedChanges } from '@/context/UnsavedChangesContext';

const LIST_PATHS = ['/liste', '/jeu'];

export function MobileTabBar() {
  const location = useLocation();
  const { attemptNavigate } = useUnsavedChanges();

  const isListActive = LIST_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`),
  );
  const isFiltersActive = !isListActive;

  return (
    <nav className="mobile-tab-bar" aria-label="Navigation principale" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={isFiltersActive}
        className={`mobile-tab mobile-tab--filters ${isFiltersActive ? 'mobile-tab--active' : 'mobile-tab--inactive'}`}
        onClick={() => attemptNavigate('/')}
      >
        Filtres
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isListActive}
        className={`mobile-tab mobile-tab--list ${isListActive ? 'mobile-tab--active' : 'mobile-tab--inactive'}`}
        onClick={() => attemptNavigate('/liste')}
      >
        Liste des jeux
      </button>
    </nav>
  );
}
