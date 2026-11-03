/**
 * Hachage déterministe d'une chaîne (algorithme djb2-like).
 * Utilisé pour tirer un attribut visuel stable à partir d'un identifiant.
 */
export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
