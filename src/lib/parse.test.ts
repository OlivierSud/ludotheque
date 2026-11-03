import { describe, expect, it } from 'vitest';
import { FALLBACK_COULEURS } from './colors';
import { parseData } from './parse';

describe('parseData', () => {
  it('renvoie null si ok est false', () => {
    expect(parseData({ ok: false })).toBeNull();
  });

  it('parse une réponse valide', () => {
    const data = parseData({
      ok: true,
      jeux: [{ id: '1', nom: 'A' }],
      criteres: [],
      updatedAt: 't',
    });
    expect(data?.jeux).toHaveLength(1);
    expect(data?.updatedAt).toBe('t');
  });

  it('écarte les entrées malformées', () => {
    const data = parseData({
      ok: true,
      jeux: [{ id: '1' }, { id: '2', nom: 'B' }],
      criteres: [],
    });
    expect(data?.jeux).toHaveLength(1);
    expect(data?.jeux[0]?.nom).toBe('B');
  });

  it('garde uniquement les couleurs hexadécimales de la feuille', () => {
    const data = parseData({
      ok: true,
      jeux: [],
      criteres: [],
      couleurs: ['#4B6A4A', 'bleu', '#fff', 42],
    });
    expect(data?.couleurs).toEqual(['#4b6a4a', '#fff']);
  });

  it('retombe sur la palette de secours sans colonne couleurs', () => {
    const data = parseData({ ok: true, jeux: [], criteres: [], couleurs: [] });
    expect(data?.couleurs).toEqual(FALLBACK_COULEURS);
  });

  it('trie les critères par ordre', () => {
    const data = parseData({
      ok: true,
      jeux: [],
      criteres: [
        { id: 'b', nom: 'B', ordre: 2, multiple: false, options: [] },
        { id: 'a', nom: 'A', ordre: 1, multiple: false, options: [] },
      ],
    });
    expect(data?.criteres[0]?.id).toBe('a');
  });
});
