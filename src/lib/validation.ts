import type { JeuDraft } from '@/types';

export type FieldErrors = Record<string, string>;

const HTTPS_URL = /^https:\/\/[^\s]+$/i;

export function isHttpsUrl(value: string): boolean {
  return HTTPS_URL.test(value);
}

export function normalizeLien(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, 'https://');
  }
  return `https://${trimmed}`;
}

export function validateJeu(draft: JeuDraft): FieldErrors {
  const errors: FieldErrors = {};
  const nom = draft.nom.trim();

  if (nom.length === 0) errors.nom = 'Le nom du jeu est obligatoire.';
  else if (nom.length > 100) errors.nom = 'Le nom ne doit pas dépasser 100 caractères.';

  const lien = normalizeLien(draft.lien);
  if (lien.length > 0) {
    if (lien.length > 500) errors.lien = 'Le lien ne doit pas dépasser 500 caractères.';
    else if (!isHttpsUrl(lien)) errors.lien = 'Le lien doit commencer par https://';
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
