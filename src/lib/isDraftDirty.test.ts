import { describe, expect, it } from 'vitest';
import type { JeuDraft } from '@/types';
import { isDraftDirty } from './isDraftDirty';

const initial: JeuDraft = {
  nom: 'Jeu',
  lien: 'https://exemple.com',
  criteres: { m: ['x'], n: ['a', 'b'] },
};

describe('isDraftDirty', () => {
  it('est faux sans modification', () => {
    expect(isDraftDirty(initial, initial)).toBe(false);
  });

  it('ignore l’ordre des sélections', () => {
    expect(isDraftDirty({ ...initial, criteres: { m: ['x'], n: ['b', 'a'] } }, initial)).toBe(
      false,
    );
  });

  it('détecte un nom modifié', () => {
    expect(isDraftDirty({ ...initial, nom: 'Autre' }, initial)).toBe(true);
  });

  it('détecte un lien modifié', () => {
    expect(isDraftDirty({ ...initial, lien: '' }, initial)).toBe(true);
  });

  it('détecte une sélection ajoutée ou retirée', () => {
    expect(isDraftDirty({ ...initial, criteres: { m: ['x', 'y'], n: ['a', 'b'] } }, initial)).toBe(
      true,
    );
    expect(isDraftDirty({ ...initial, criteres: { m: [], n: ['a', 'b'] } }, initial)).toBe(true);
  });

  it('détecte un critère vidé', () => {
    expect(isDraftDirty({ ...initial, criteres: {} }, initial)).toBe(true);
  });
});
