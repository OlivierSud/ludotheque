import type React from 'react';

export interface BookStyleResult {
  readonly transform: string;
  readonly style: React.CSSProperties;
}

/**
 * Calcule un décalage horizontal et une rotation pseudo-aléatoires déterministes
 * basés sur l'identifiant pour afficher une pile de livres naturelle et stable.
 */
export function getBookStyle(id: string, index: number = 0): BookStyleResult {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash) + index * 7;

  // Rotation subtile entre -1.2° et +1.2°
  const rotVal = Number((((absHash % 25) - 12) * 0.1).toFixed(2));
  // Décalage horizontal subtil entre -6px et +6px
  const shiftVal = (Math.floor(absHash / 25) % 13) - 6;

  const transform = `translate3d(${shiftVal}px, 0, 0) rotate(${rotVal}deg)`;

  return {
    transform,
    style: {
      '--book-rot': `${rotVal}deg`,
      '--book-shift': `${shiftVal}px`,
      transform,
    } as React.CSSProperties,
  };
}
