import type { Critere } from '@/types';
import { colorHex, colorText } from '@/lib/colors';
import { useData } from '@/context/DataContext';
import { useFilters } from '@/context/FiltersContext';

interface FiltersProps {
  readonly hideHeader?: boolean;
}

export function Filters({ hideHeader = false }: FiltersProps) {
  const { data } = useData();
  const { selection, toggle, clear, activeCount } = useFilters();

  if (data === null) return null;

  return (
    <section className="filters" aria-label="Filtres">
      {!hideHeader && (
        <div className="filters__header">
          <span className="filters__section-title">Filtres</span>
          {activeCount > 0 && (
            <button type="button" className="filters__clear-btn" onClick={clear}>
              Réinitialiser ({activeCount})
            </button>
          )}
        </div>
      )}

      <div className="filters__list">
        {data.criteres.map((critere: Critere) => {
          const selected = selection[critere.id] ?? [];
          return (
            <div className="filter-row" key={critere.id}>
              <div className="filter-row__label-wrap">
                <span className="filter-row__title" title={critere.nom}>
                  {critere.nom}
                </span>
                {selected.length > 0 && (
                  <span className="filter-row__badge" title={`${selected.length} actif(s)`}>
                    {selected.length}
                  </span>
                )}
              </div>
              <div className="filter-row__options">
                {critere.options.map((option) => {
                  const active = selected.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`pill ${active ? 'pill--active' : ''}`}
                      aria-pressed={active}
                      style={
                        active
                          ? {
                              backgroundColor: colorHex(option.couleur),
                              color: colorText(option.couleur),
                              borderColor: colorHex(option.couleur),
                            }
                          : undefined
                      }
                      onClick={() => toggle(critere, option.id)}
                    >
                      {active && (
                        <span className="pill__check" aria-hidden="true">
                          ✓{' '}
                        </span>
                      )}
                      {option.libelle}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
