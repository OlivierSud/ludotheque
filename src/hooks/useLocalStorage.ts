import { useCallback, useEffect, useState } from 'react';

/**
 * État persistant dans le `localStorage`.
 * Tolère un stockage indisponible (navigation privée, quota, JSON corrompu).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : (JSON.parse(stored) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Stockage plein ou désactivé : l'application reste utilisable en mémoire.
    }
  }, [key, value]);

  const update = useCallback((next: T | ((previous: T) => T)) => {
    setValue((previous) =>
      typeof next === 'function' ? (next as (previous: T) => T)(previous) : next,
    );
  }, []);

  return [value, update] as const;
}
