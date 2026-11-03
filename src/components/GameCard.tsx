import type React from 'react';
import type { Jeu } from '@/types';
import { pickGameVisual } from '@/lib/colors';
import { getBookStyle } from '@/lib/bookStyle';

interface GameCardProps {
  readonly jeu: Jeu;
  /** Palette hexadécimale issue de la feuille (`couleurs`). */
  readonly palette: readonly string[];
  readonly index?: number;
  readonly onOpen: (jeu: Jeu) => void;
  readonly onEdit?: (jeu: Jeu) => void;
}

export function GameCard({ jeu, palette, index = 0, onOpen, onEdit }: GameCardProps) {
  const { style } = getBookStyle(jeu.id, index);
  const visual = pickGameVisual(jeu.id, palette);

  return (
    <div
      className="game-card"
      style={
        {
          ...style,
          transform: undefined,
          '--game-bg': visual.background,
          '--game-fg': visual.foreground,
          '--game-spine': visual.spine,
          '--game-fg-soft': visual.foregroundSoft,
        } as React.CSSProperties
      }
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
