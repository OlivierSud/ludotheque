import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Critere, Selection } from '@/types';

interface FiltersContextValue {
  readonly selection: Selection;
  readonly toggle: (critere: Critere, optionId: string) => void;
  readonly clear: () => void;
  readonly activeCount: number;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { readonly children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({});

  const toggle = useCallback((critere: Critere, optionId: string) => {
    setSelection((current) => {
      const currentIds = current[critere.id] ?? [];
      if (critere.multiple) {
        const next = currentIds.includes(optionId)
          ? currentIds.filter((id) => id !== optionId)
          : [...currentIds, optionId];
        return { ...current, [critere.id]: next };
      }
      return { ...current, [critere.id]: currentIds.includes(optionId) ? [] : [optionId] };
    });
  }, []);

  const clear = useCallback(() => setSelection({}), []);

  const value = useMemo<FiltersContextValue>(() => {
    const activeCount = Object.values(selection).filter((ids) => ids.length > 0).length;
    return { selection, toggle, clear, activeCount };
  }, [selection, toggle, clear]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const value = useContext(FiltersContext);
  if (value === null) throw new Error('useFilters doit être utilisé dans FiltersProvider');
  return value;
}
