import { describe, expect, it } from 'vitest';
import { validateJeu, hasErrors, normalizeLien } from './validation';

describe('normalizeLien', () => {
  it('ajoute https:// si absent', () => {
    expect(normalizeLien('www.exemple.com')).toBe('https://www.exemple.com');
    expect(normalizeLien('exemple.com/jeu')).toBe('https://exemple.com/jeu');
  });

  it('remplace http:// par https://', () => {
    expect(normalizeLien('http://exemple.com')).toBe('https://exemple.com');
  });

  it('conserve https:// si déjà présent', () => {
    expect(normalizeLien('https://exemple.com')).toBe('https://exemple.com');
  });

  it('renvoie une chaîne vide si vide', () => {
    expect(normalizeLien('')).toBe('');
    expect(normalizeLien('   ')).toBe('');
  });
});

describe('validateJeu', () => {
  it('accepte un jeu valide', () => {
    expect(hasErrors(validateJeu({ nom: 'Azul', lien: 'https://x.com', criteres: {} }))).toBe(
      false,
    );
  });

  it('accepte et normalise un lien sans https://', () => {
    expect(hasErrors(validateJeu({ nom: 'Azul', lien: 'monjeu.fr', criteres: {} }))).toBe(false);
  });

  it('rejette un nom vide', () => {
    expect(validateJeu({ nom: '', lien: '', criteres: {} }).nom).toBeDefined();
  });

  it('rejette un nom trop long', () => {
    expect(validateJeu({ nom: 'a'.repeat(101), lien: '', criteres: {} }).nom).toBeDefined();
  });

  it('accepte un lien vide', () => {
    expect(validateJeu({ nom: 'Azul', lien: '', criteres: {} }).lien).toBeUndefined();
  });
});
