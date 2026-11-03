import type { JeuDraft } from '@/types';

function sameIds(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((id, index) => id === b[index]);
}

/** Vrai si le brouillon diffère des valeurs d'origine du jeu. */
export function isDraftDirty(current: JeuDraft, initial: JeuDraft): boolean {
  if (current.nom !== initial.nom || current.lien !== initial.lien) return true;

  const critereIds = new Set([...Object.keys(current.criteres), ...Object.keys(initial.criteres)]);
  for (const id of critereIds) {
    if (!sameIds(current.criteres[id] ?? [], initial.criteres[id] ?? [])) return true;
  }
  return false;
}
