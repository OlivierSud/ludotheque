import type { ColorKey } from '@/types';
import { PALETTE } from '@/types';
import { hashString } from '@/lib/stableHash';

export const COLOR_HEX: Record<ColorKey, string> = {
  olive: '#4b6a4a',
  blue: '#005b9f',
  teal: '#00959f',
  purple: '#8b73a3',
  pink: '#f26d7d',
  yellow: '#ffc222',
  orange: '#e25822',
};

export const COLOR_TEXT: Record<ColorKey, string> = {
  olive: '#ffffff',
  blue: '#ffffff',
  teal: '#ffffff',
  purple: '#ffffff',
  pink: '#ffffff',
  yellow: '#2b2b2b',
  orange: '#ffffff',
};

export function isColorKey(value: unknown): value is ColorKey {
  return typeof value === 'string' && (PALETTE as readonly string[]).includes(value);
}

export function colorHex(key: ColorKey): string {
  return COLOR_HEX[key];
}

export function colorText(key: ColorKey): string {
  return COLOR_TEXT[key];
}

/** Palette de secours quand la colonne `couleurs` de la feuille est absente ou vide. */
export const FALLBACK_COULEURS: readonly string[] = PALETTE.map((key) => COLOR_HEX[key]);

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const DARK_TEXT = '#2b2b2b';
const LIGHT_TEXT = '#ffffff';

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR_RE.test(value.trim());
}

export interface GameVisual {
  /** Couleur de fond de la carte-livre. */
  readonly background: string;
  /** Couleur de texte garantissant le meilleur contraste. */
  readonly foreground: string;
  /** Variante pour le liseré gauche et les bordures. */
  readonly spine: string;
  /** Couleur de texte translucide pour les éléments secondaires. */
  readonly foregroundSoft: string;
}

function parseHex(hex: string): readonly [number, number, number] {
  const value = hex.trim().slice(1).toLowerCase();
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb: readonly [number, number, number]): number {
  return (
    0.2126 * channelLuminance(rgb[0]) +
    0.7152 * channelLuminance(rgb[1]) +
    0.0722 * channelLuminance(rgb[2])
  );
}

/** Texte blanc ou sombre, selon celui qui contraste le plus avec le fond. */
export function contrastText(background: string): string {
  const luminance = relativeLuminance(parseHex(background));
  const darkLuminance = relativeLuminance(parseHex(DARK_TEXT));
  const contrastLight = 1.05 / (luminance + 0.05);
  const contrastDark = (luminance + 0.05) / (darkLuminance + 0.05);
  return contrastDark >= contrastLight ? DARK_TEXT : LIGHT_TEXT;
}

function mix(rgb: readonly [number, number, number], target: number, amount: number): string {
  return (
    '#' +
    rgb
      .map((channel) => {
        const value = Math.round(channel + (target - channel) * amount);
        return value.toString(16).padStart(2, '0');
      })
      .join('')
  );
}

/** Couleur tirée de façon pseudo-aléatoire mais stable pour un même jeu. */
export function pickGameColor(id: string, palette: readonly string[]): string {
  const usable = palette.filter(isHexColor);
  const list = usable.length > 0 ? usable : FALLBACK_COULEURS;
  const index = hashString(id) % list.length;
  return (list[index] ?? FALLBACK_COULEURS[0] ?? DARK_TEXT).trim().toLowerCase();
}

/** Fond, texte et liseré d'une carte-livre, dérivés d'une couleur de la palette. */
export function pickGameVisual(id: string, palette: readonly string[]): GameVisual {
  const background = pickGameColor(id, palette);
  const foreground = contrastText(background);
  const rgb = parseHex(background);
  const dark = relativeLuminance(rgb) < 0.12;
  return {
    background,
    foreground,
    spine: mix(rgb, dark ? 255 : 0, dark ? 0.25 : 0.2),
    foregroundSoft: `${foreground}${foreground === LIGHT_TEXT ? '38' : '2e'}`,
  };
}
