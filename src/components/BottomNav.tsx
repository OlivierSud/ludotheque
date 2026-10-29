import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Jeux' },
  { to: '/filtres', label: 'Filtres' },
  { to: '/liste', label: 'Liste' },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
