import type { Jeu, Selection } from '@/types';

/**
 * Filtre les jeux : OU à l'intérieur d'un critère, ET entre les critères.
 */
export function filterGames(jeux: readonly Jeu[], selection: Selection): readonly Jeu[] {
  const active = Object.entries(selection).filter(([, ids]) => ids.length > 0);
  if (active.length === 0) return jeux;

  return jeux.filter((jeu) =>
    active.every(([critereId, ids]) => {
      const values = jeu.criteres[critereId] ?? [];
      return values.some((id) => ids.includes(id));
    }),
  );
}
