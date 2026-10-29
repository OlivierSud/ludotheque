import { useLocation, useNavigate } from 'react-router-dom';

const LIST_PATHS = ['/liste', '/jeu'];

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

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
        onClick={() => navigate('/')}
      >
        Filtres
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isListActive}
        className={`mobile-tab mobile-tab--list ${isListActive ? 'mobile-tab--active' : 'mobile-tab--inactive'}`}
        onClick={() => navigate('/liste')}
      >
        Liste des jeux
      </button>
    </nav>
  );
}
