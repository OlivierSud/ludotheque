import { describe, expect, it } from 'vitest';
import { getBookStyle } from './bookStyle';

describe('getBookStyle', () => {
  it('est déterministe pour un id et index donnés', () => {
    const res1 = getBookStyle('game-123', 0);
    const res2 = getBookStyle('game-123', 0);
    expect(res1.transform).toBe(res2.transform);
    expect(res1.style).toEqual(res2.style);
  });

  it('génère des rotations et décalages bornés', () => {
    for (let i = 0; i < 50; i++) {
      const { style } = getBookStyle(`game-${i}`, i);
      const styleRecord = style as unknown as Record<string, string>;
      const rot = parseFloat(styleRecord['--book-rot'] ?? '0');
      const shift = parseFloat(styleRecord['--book-shift'] ?? '0');

      expect(rot).toBeGreaterThanOrEqual(-1.5);
      expect(rot).toBeLessThanOrEqual(1.5);
      expect(shift).toBeGreaterThanOrEqual(-8);
      expect(shift).toBeLessThanOrEqual(8);
    }
  });

  it('différencie les jeux ayant des identifiants distincts', () => {
    const resA = getBookStyle('alpha', 0);
    const resB = getBookStyle('omega', 1);
    expect(resA.transform).not.toBe(resB.transform);
  });
});
