import { useEffect } from 'react';
import { Filters } from '@/components/Filters';
import { useFilters } from '@/context/FiltersContext';

interface FiltersModalProps {
  readonly onClose: () => void;
}

export function FiltersModal({ onClose }: FiltersModalProps) {
  const { activeCount, clear } = useFilters();

  // Fermer sur Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Bloquer le scroll body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="filters-modal" role="dialog" aria-modal="true" aria-label="Filtres">
      <div className="filters-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="filters-modal__sheet">
        <div className="filters-modal__header">
          <span className="filters-modal__title">Filtres</span>
          <div className="filters-modal__actions">
            {activeCount > 0 && (
              <button type="button" className="filters__clear-btn" onClick={clear}>
                Réinitialiser ({activeCount})
              </button>
            )}
            <button
              type="button"
              className="filters-modal__close"
              onClick={onClose}
              aria-label="Fermer les filtres"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="filters-modal__body">
          <Filters hideHeader />
        </div>
        <div className="filters-modal__footer">
          <button type="button" className="primary-button filters-modal__apply" onClick={onClose}>
            Voir les résultats
            {activeCount > 0 && ` (${activeCount} filtre${activeCount > 1 ? 's' : ''})`}
          </button>
        </div>
      </div>
    </div>
  );
}
