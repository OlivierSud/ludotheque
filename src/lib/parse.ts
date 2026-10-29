import type { CriteresValues, Critere, Jeu, LudothequeData, Option } from '@/types';
import { isColorKey } from '@/lib/colors';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseOption(raw: unknown): Option | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw['id']);
  const libelle = asString(raw['libelle']);
  const ordre = asNumber(raw['ordre']);
  if (id === null || libelle === null || ordre === null) return null;
  return { id, libelle, couleur: isColorKey(raw['couleur']) ? raw['couleur'] : 'blue', ordre };
}

function parseCritere(raw: unknown): Critere | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw['id']);
  const nom = asString(raw['nom']);
  const ordre = asNumber(raw['ordre']);
  if (id === null || nom === null || ordre === null) return null;

  const options = Array.isArray(raw['options'])
    ? raw['options'].map(parseOption).filter((item): item is Option => item !== null)
    : [];

  return { id, nom, ordre, multiple: raw['multiple'] === true, options };
}

function parseCriteresValues(raw: unknown): CriteresValues {
  if (!isRecord(raw)) return {};
  const values: Record<string, readonly string[]> = {};
  for (const [critereId, ids] of Object.entries(raw)) {
    if (Array.isArray(ids)) {
      values[critereId] = ids.filter((id): id is string => typeof id === 'string');
    }
  }
  return values;
}

function parseJeu(raw: unknown): Jeu | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw['id']);
  const nom = asString(raw['nom']);
  if (id === null || nom === null) return null;
  return {
    id,
    nom,
    lien: asString(raw['lien']) ?? '',
    criteres: parseCriteresValues(raw['criteres']),
  };
}

/**
 * Valide la réponse de l'API. Toute entrée malformée est écartée, jamais rendue.
 */
export function parseData(raw: unknown): LudothequeData | null {
  if (!isRecord(raw) || raw['ok'] !== true) return null;
  if (!Array.isArray(raw['jeux']) || !Array.isArray(raw['criteres'])) return null;

  return {
    jeux: raw['jeux'].map(parseJeu).filter((item): item is Jeu => item !== null),
    criteres: raw['criteres']
      .map(parseCritere)
      .filter((item): item is Critere => item !== null)
      .sort((a, b) => a.ordre - b.ordre),
    updatedAt: asString(raw['updatedAt']) ?? '',
  };
}
