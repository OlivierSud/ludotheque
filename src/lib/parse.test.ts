import { describe, expect, it } from 'vitest';
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
