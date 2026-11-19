import type React from 'react';
import type { Jeu } from '@/types';
import { GAME_PALETTE, pickGameVisual, type GameVisual } from '@/lib/colors';
import { getBookStyle } from '@/lib/bookStyle';

interface GameCardProps {
  readonly jeu: Jeu;
  /** Palette hexadécimale (par défaut GAME_PALETTE). */
  readonly palette?: readonly string[] | undefined;
  readonly visual?: GameVisual | undefined;
  readonly index?: number;
  readonly onOpen: (jeu: Jeu) => void;
  readonly onEdit?: (jeu: Jeu) => void;
}

export function GameCard({
  jeu,
  palette = GAME_PALETTE,
  visual,
  index = 0,
  onOpen,
  onEdit,
}: GameCardProps) {
  const { style } = getBookStyle(jeu.id, index);
  const v = visual ?? pickGameVisual(jeu.id, palette);

  return (
    <div
      className="game-card"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('.game-card__info-btn')) {
          return;
        }
        onOpen(jeu);
      }}
      style={
        {
          ...style,
          transform: undefined,
          '--game-bg': v.background,
          '--game-fg': v.foreground,
          '--game-spine': v.spine,
          '--game-fg-soft': v.foregroundSoft,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className="game-card__main"
        onClick={(event) => {
          event.stopPropagation();
          onOpen(jeu);
        }}
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
