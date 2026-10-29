import { useNavigate } from 'react-router-dom';
import type { Jeu } from '@/types';
import { gameColor } from '@/lib/filterGames';
import { useData } from '@/context/DataContext';
import { GameCard } from '@/components/GameCard';

export function DatabasePage() {
  const { data } = useData();
  const navigate = useNavigate();

  return (
    <div className="screen__inner">
      <header className="page-header">
        <div>
          <h1 className="page-title">Base de données</h1>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate('/jeu/nouveau')}
          aria-label="Ajouter un jeu"
        >
          Nouveau jeu
        </button>
      </header>

      <section className="results book-stack">
        {data === null && <p className="state">Chargement…</p>}
        {data !== null && data.jeux.length === 0 && <p className="state">Aucun jeu enregistré.</p>}
        {data !== null &&
          data.jeux.map((jeu: Jeu, index: number) => (
            <GameCard
              key={jeu.id}
              jeu={jeu}
              couleur={gameColor(jeu, data.criteres)}
              index={index}
              onOpen={() => navigate(`/jeu/${jeu.id}`)}
              onEdit={() => navigate(`/jeu/${jeu.id}`)}
            />
          ))}
      </section>
    </div>
  );
}
