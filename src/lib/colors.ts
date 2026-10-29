import type { ColorKey } from '@/types';
import { PALETTE } from '@/types';

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
