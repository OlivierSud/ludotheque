import type { Game } from '@/types';
import { formatAge, formatDuration, formatPlayers } from '@/lib/games';

interface GameCardProps {
  readonly game: Game;
  readonly isFavorite: boolean;
  readonly onToggleFavorite: (id: string) => void;
}

export function GameCard({ game, isFavorite, onToggleFavorite }: GameCardProps) {
  return (
    <article className="card" aria-labelledby={`game-${game.id}-title`}>
      <header className="card__header">
        <span className="card__category">{game.category}</span>
        <button
          type="button"
          className="card__favorite"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? `Retirer ${game.title} des favoris` : `Ajouter ${game.title} aux favoris`
          }
          onClick={() => onToggleFavorite(game.id)}
        >
          <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        </button>
      </header>

      <h2 className="card__title" id={`game-${game.id}-title`}>
        {game.title}
      </h2>
      <p className="card__description">{game.description}</p>

      <ul className="card__meta">
        <li>{formatPlayers(game)}</li>
        <li>{formatDuration(game.durationMinutes)}</li>
        <li>{formatAge(game.minAge)}</li>
      </ul>

      <ul className="card__tags" aria-label="Tags">
        {game.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    </article>
  );
}
