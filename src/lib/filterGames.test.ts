import { describe, expect, it } from 'vitest';
import type { Jeu } from '@/types';
import { filterGames } from './filterGames';

const jeux: readonly Jeu[] = [
  { id: '1', nom: 'A', lien: '', criteres: { m: ['x'] } },
  { id: '2', nom: 'B', lien: '', criteres: { m: ['y'] } },
];

describe('filterGames', () => {
  it('renvoie tout sans sélection', () => {
    expect(filterGames(jeux, {})).toHaveLength(2);
  });

  it('filtre par critère (OU interne)', () => {
    expect(filterGames(jeux, { m: ['x'] })).toHaveLength(1);
  });

  it('renvoie vide si aucune correspondance', () => {
    expect(filterGames(jeux, { m: ['z'] })).toHaveLength(0);
  });

  it('combine les critères par ET', () => {
    const data: readonly Jeu[] = [
      { id: '3', nom: 'C', lien: '', criteres: { m: ['x'], n: ['a'] } },
      { id: '4', nom: 'D', lien: '', criteres: { m: ['x'], n: ['b'] } },
    ];
    expect(filterGames(data, { m: ['x'], n: ['a'] })).toHaveLength(1);
  });
});
