import { Link } from 'react-router-dom';
import { useFilters } from '@/context/FiltersContext';
import { Filters } from '@/components/Filters';

export function FiltersPage() {
  const { clear, activeCount } = useFilters();

  return (
    <div className="screen__inner">
      <header className="page-header">
        <div>
          <h1 className="page-title">Filtres</h1>
          <p className="page-subtitle">Affinez la recherche</p>
        </div>
      </header>

      <Filters />

      <div className="panel-toolbar">
        {activeCount > 0 && (
          <button type="button" className="secondary-button" onClick={clear}>
            Tout effacer
          </button>
        )}
        <Link to="/" className="primary-button">
          Voir les jeux
        </Link>
      </div>
    </div>
  );
}
