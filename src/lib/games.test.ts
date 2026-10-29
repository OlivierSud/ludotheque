import { describe, expect, it } from 'vitest';
import {
  filterGames,
  formatAge,
  formatDuration,
  formatGameCount,
  formatPlayers,
  normalize,
} from '@/lib/games';
import { games } from '@/data/games';
import type { Game } from '@/types';

const game = (overrides: Partial<Game>): Game => ({
  id: 'test',
  title: 'Test',
  minPlayers: 2,
  maxPlayers: 4,
  minAge: 8,
  durationMinutes: 30,
  category: 'Famille',
  description: '',
  tags: [],
  ...overrides,
});

describe('normalize', () => {
  it('retire les accents et la casse', () => {
    expect(normalize('  Épidémie  ')).toBe('epidemie');
  });
});

describe('filterGames', () => {
  it('retourne tout sans filtre', () => {
    expect(filterGames(games, { query: '', category: 'Toutes' })).toHaveLength(games.length);
  });

  it('filtre par catégorie', () => {
    const result = filterGames(games, { query: '', category: 'Coopératif' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.category === 'Coopératif')).toBe(true);
  });

  it('ignore les accents et la casse dans la recherche', () => {
    const result = filterGames(games, { query: 'epidemie', category: 'Toutes' });
    expect(result.map((item) => item.id)).toContain('pandemic');
  });

  it('filtre sur les tags', () => {
    const result = filterGames(games, { query: 'campagne', category: 'Toutes' });
    expect(result.map((item) => item.id)).toEqual(['the-crew']);
  });

  it('restreint aux favoris quand demandé', () => {
    const result = filterGames(games, {
      query: '',
      category: 'Toutes',
      favoritesOnly: true,
      favorites: new Set(['dixit']),
    });
    expect(result.map((item) => item.id)).toEqual(['dixit']);
  });

  it('combine recherche et catégorie', () => {
    expect(filterGames(games, { query: 'azul', category: 'Stratégie' })).toHaveLength(0);
  });
});

describe('formatage', () => {
  it('affiche une plage de joueurs', () => {
    expect(formatPlayers(game({ minPlayers: 3, maxPlayers: 5 }))).toBe('3–5 joueurs');
  });

  it('affiche un joueur unique au singulier', () => {
    expect(formatPlayers(game({ minPlayers: 1, maxPlayers: 1 }))).toBe('1 joueur');
  });

  it('convertit les durées en heures', () => {
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(120)).toBe('2 h');
    expect(formatDuration(90)).toBe('1 h 30');
  });

  it('affiche l’âge minimum', () => {
    expect(formatAge(10)).toBe('Dès 10 ans');
  });

  it('accorde le compteur de jeux', () => {
    expect(formatGameCount(0)).toBe('Aucun jeu');
    expect(formatGameCount(1)).toBe('1 jeu');
    expect(formatGameCount(2)).toBe('2 jeux');
  });
});
