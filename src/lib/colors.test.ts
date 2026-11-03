import { describe, expect, it } from 'vitest';
import { FALLBACK_COULEURS, contrastText, isHexColor, pickGameColor } from './colors';

const PALETTE = ['#005b9f', '#ffc222', '#4b6a4a'];

describe('isHexColor', () => {
  it('accepte les formats courts et longs', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#005B9F')).toBe(true);
  });

  it('refuse les autres formats', () => {
    expect(isHexColor('blue')).toBe(false);
    expect(isHexColor('#12')).toBe(false);
    expect(isHexColor(null)).toBe(false);
  });
});

describe('pickGameColor', () => {
  it('est stable pour un même identifiant', () => {
    expect(pickGameColor('game-42', PALETTE)).toBe(pickGameColor('game-42', PALETTE));
  });

  it('ne renvoie que des couleurs de la palette', () => {
    for (let i = 0; i < 100; i++) {
      expect(PALETTE).toContain(pickGameColor(`jeu-${i}`, PALETTE));
    }
  });

  it('ignore les valeurs invalides et retombe sur la palette de secours', () => {
    expect(FALLBACK_COULEURS).toContain(pickGameColor('x', ['nope', '#12345']));
    expect(FALLBACK_COULEURS).toContain(pickGameColor('x', []));
  });
});

describe('contrastText', () => {
  it('écrit en blanc sur les fonds sombres', () => {
    expect(contrastText('#005b9f')).toBe('#ffffff');
    expect(contrastText('#000000')).toBe('#ffffff');
  });

  it('écrit en sombre sur les fonds clairs', () => {
    expect(contrastText('#ffc222')).toBe('#2b2b2b');
    expect(contrastText('#ffffff')).toBe('#2b2b2b');
  });
});
