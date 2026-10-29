export const GAME_CATEGORIES = [
  'Ambiance',
  'Famille',
  'Stratégie',
  'Coopératif',
  'Enfants',
] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

/** Un jeu de société de la collection. */
export interface Game {
  readonly id: string;
  readonly title: string;
  readonly minPlayers: number;
  readonly maxPlayers: number;
  readonly minAge: number;
  readonly durationMinutes: number;
  readonly category: GameCategory;
  readonly description: string;
  readonly tags: readonly string[];
}
