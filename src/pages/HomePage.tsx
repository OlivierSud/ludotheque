import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Jeu } from '@/types';
import { filterGames, gameColor } from '@/lib/filterGames';
import { useData } from '@/context/DataContext';
import { useFilters } from '@/context/FiltersContext';
import { Filters } from '@/components/Filters';
import { GameCard } from '@/components/GameCard';

export function HomePage() {
  const { data, loading, error, refresh } = useData();
  const { selection } = useFilters();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const jeux = useMemo(
    () => (data === null ? [] : filterGames(data.jeux, selection)),
    [data, selection],
  );

  const openGame = (jeu: Jeu) => {
    if (jeu.lien === '') {
      navigate(`/jeu/${jeu.id}`);
      return;
    }
    window.open(jeu.lien, '_blank', 'noopener,noreferrer');
    setToast(jeu.nom);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="screen__inner">
      {error !== null && data !== null && (
        <p className="banner" role="status">
          Données hors ligne — dernière version connue affichée.
        </p>
      )}

      {loading && data === null && <div className="state">Chargement…</div>}

      {error !== null && data === null && (
        <div className="state">
          <p>Impossible de charger la ludothèque.</p>
          <button type="button" className="secondary-button" onClick={() => void refresh()}>
            Réessayer
          </button>
        </div>
      )}

      {data !== null && (
        <>
          <Filters />

          <p className="section-label section-label--results">Résultats ({jeux.length})</p>

          <section className="results book-stack">
            {jeux.length === 0 ? (
              <div className="state">Aucun jeu ne correspond aux filtres.</div>
            ) : (
              jeux.map((jeu, index) => (
                <GameCard
                  key={jeu.id}
                  jeu={jeu}
                  couleur={gameColor(jeu, data.criteres)}
                  index={index}
                  onOpen={openGame}
                  onEdit={(j) => navigate(`/jeu/${j.id}`)}
                />
              ))
            )}
          </section>
        </>
      )}

      {toast !== null && (
        <div className="toast" role="status">
          <span>Ouverture de : {toast}</span>
          <button type="button" className="toast__close" onClick={() => setToast(null)}>
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
