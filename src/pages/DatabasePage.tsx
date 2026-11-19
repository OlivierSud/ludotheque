import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Jeu } from '@/types';
import { normalizeLien } from '@/lib/validation';
import { GAME_PALETTE, pickGamesVisuals } from '@/lib/colors';
import { useData } from '@/context/DataContext';
import { GameCard } from '@/components/GameCard';

export function DatabasePage() {
  const { data } = useData();
  const navigate = useNavigate();

  const gameVisuals = useMemo(
    () => (data ? pickGamesVisuals(data.jeux, GAME_PALETTE) : []),
    [data],
  );

  const openGame = (jeu: Jeu) => {
    const url = normalizeLien(jeu.lien);
    if (url === '') {
      navigate(`/jeu/${jeu.id}`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="screen__inner">
      <div className="panel-toolbar">
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate('/jeu/nouveau')}
          aria-label="Ajouter un jeu"
        >
          Nouveau jeu
        </button>
      </div>

      <section className="results book-stack" aria-label="Liste des jeux">
        {data === null && <p className="state">Chargement…</p>}
        {data !== null && data.jeux.length === 0 && <p className="state">Aucun jeu enregistré.</p>}
        {data !== null &&
          data.jeux.map((jeu: Jeu, index: number) => (
            <GameCard
              key={jeu.id}
              jeu={jeu}
              palette={GAME_PALETTE}
              visual={gameVisuals[index]}
              index={index}
              onOpen={openGame}
              onEdit={() => navigate(`/jeu/${jeu.id}`)}
            />
          ))}
      </section>
    </div>
  );
}
