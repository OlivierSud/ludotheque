import { describe, expect, it } from 'vitest';
import {
  FALLBACK_COULEURS,
  GAME_PALETTE,
  contrastText,
  isHexColor,
  pickGameColor,
  pickGamesVisuals,
} from './colors';

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

  it('ne renvoie jamais la même couleur que le jeu précédent', () => {
    let prev: string | undefined = undefined;
    for (let i = 0; i < 100; i++) {
      const current = pickGameColor(`jeu-${i}`, GAME_PALETTE, prev);
      if (prev !== undefined) {
        expect(current).not.toBe(prev);
      }
      expect(GAME_PALETTE).toContain(current);
      prev = current;
    }
  });
});

describe('pickGamesVisuals', () => {
  it('garantit qu’aucun jeu consécutif n’a la même couleur dans une liste', () => {
    const jeux = Array.from({ length: 60 }, (_, i) => ({
      id: `jeu-${i}`,
      nom: `Jeu ${i}`,
      lien: '',
      criteres: {},
    }));
    const visuals = pickGamesVisuals(jeux, GAME_PALETTE);
    expect(visuals).toHaveLength(60);
    for (let i = 1; i < visuals.length; i++) {
      expect(visuals[i]?.background).not.toBe(visuals[i - 1]?.background);
    }
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

  it('garantit un texte lisible sur les 8 couleurs de GAME_PALETTE', () => {
    for (const color of GAME_PALETTE) {
      const text = contrastText(color);
      expect(['#ffffff', '#2b2b2b']).toContain(text);
    }
    // Jaune et vert lime vifs imposent un texte sombre
    expect(contrastText('#ffd600')).toBe('#2b2b2b');
    expect(contrastText('#39ff14')).toBe('#2b2b2b');
    // Bleu royal et violet imposent un texte blanc
    expect(contrastText('#1e40ff')).toBe('#ffffff');
    expect(contrastText('#6a00ff')).toBe('#ffffff');
  });
});
