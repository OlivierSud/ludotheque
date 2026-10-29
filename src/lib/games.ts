import type { Game, GameCategory } from '@/types';

export type CategoryFilter = GameCategory | 'Toutes';

export interface GameFilter {
  readonly query: string;
  readonly category: CategoryFilter;
  readonly favoritesOnly?: boolean;
  readonly favorites?: ReadonlySet<string>;
}

/** Normalise une chaîne pour une recherche insensible à la casse et aux accents. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Filtre la collection selon la recherche texte, la catégorie et les favoris. */
export function filterGames(games: readonly Game[], filter: GameFilter): Game[] {
  const query = normalize(filter.query);
  const favorites = filter.favorites ?? new Set<string>();

  return games.filter((game) => {
    if (filter.category !== 'Toutes' && game.category !== filter.category) {
      return false;
    }
    if (filter.favoritesOnly === true && !favorites.has(game.id)) {
      return false;
    }
    if (query === '') {
      return true;
    }
    const haystack = normalize(
      [game.title, game.description, game.category, ...game.tags].join(' '),
    );
    return haystack.includes(query);
  });
}

/** "3–4 joueurs" */
export function formatPlayers(game: Game): string {
  if (game.minPlayers === game.maxPlayers) {
    return `${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`;
  }
  return `${game.minPlayers}–${game.maxPlayers} joueurs`;
}

/** "90 min" / "1 h 30" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest}`;
}

/** "Dès 10 ans" */
export function formatAge(minAge: number): string {
  return `Dès ${minAge} ans`;
}

/** Compteur singulier/pluriel pour l'affichage des résultats. */
export function formatGameCount(count: number): string {
  return count === 0 ? 'Aucun jeu' : `${count} jeu${count > 1 ? 'x' : ''}`;
}
