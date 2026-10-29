import type { ColorKey, Jeu } from '@/types';
import { colorHex } from '@/lib/colors';
import { getBookStyle } from '@/lib/bookStyle';

interface GameCardProps {
  readonly jeu: Jeu;
  readonly couleur: ColorKey;
  readonly index?: number;
  readonly onOpen: (jeu: Jeu) => void;
  readonly onEdit?: (jeu: Jeu) => void;
}

export function GameCard({ jeu, couleur, index = 0, onOpen, onEdit }: GameCardProps) {
  const { style } = getBookStyle(jeu.id, index);

  return (
    <div
      className="game-card"
      style={{
        ...style,
        transform: undefined,
        borderLeftColor: colorHex(couleur),
      }}
    >
      <button
        type="button"
        className="game-card__main"
        onClick={() => onOpen(jeu)}
        aria-label={`Ouvrir ${jeu.nom}`}
      >
        <span className="game-card__title">{jeu.nom}</span>
      </button>

      <div className="game-card__actions">
        {onEdit && (
          <button
            type="button"
            className="game-card__info-btn"
            onClick={() => onEdit(jeu)}
            aria-label={`Fiche et édition de ${jeu.nom}`}
            title="Fiche du jeu / Éditer"
          >
            i
          </button>
        )}
        <span className="game-card__diamond" aria-hidden="true">
          ◆
        </span>
      </div>
    </div>
  );
}
