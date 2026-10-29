export const PALETTE = ['olive', 'blue', 'teal', 'purple', 'pink', 'yellow', 'orange'] as const;

export type ColorKey = (typeof PALETTE)[number];

export interface Option {
  readonly id: string;
  readonly libelle: string;
  readonly couleur: ColorKey;
  readonly ordre: number;
}

export interface Critere {
  readonly id: string;
  readonly nom: string;
  readonly ordre: number;
  readonly multiple: boolean;
  readonly options: readonly Option[];
}

export type CriteresValues = Readonly<Record<string, readonly string[]>>;

export interface Jeu {
  readonly id: string;
  readonly nom: string;
  readonly lien: string;
  readonly criteres: CriteresValues;
}

export interface LudothequeData {
  readonly jeux: readonly Jeu[];
  readonly criteres: readonly Critere[];
  readonly updatedAt: string;
}

export type Selection = Readonly<Record<string, readonly string[]>>;

export interface JeuDraft {
  readonly nom: string;
  readonly lien: string;
  readonly criteres: Readonly<Record<string, readonly string[]>>;
}
