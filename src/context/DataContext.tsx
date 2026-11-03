/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { LudothequeData } from '@/types';
import { parseData } from '@/lib/parse';
import { ApiError, fetchData } from '@/services/api';

const CACHE_KEY = 'ludotheque:data:v1';

interface DataContextValue {
  readonly data: LudothequeData | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

function readCache(): LudothequeData | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parseData({ ok: true, ...parsed });
  } catch {
    return null;
  }
}

function writeCache(data: LudothequeData): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Stockage indisponible : l'application fonctionne sans cache.
  }
}

export function DataProvider({ children }: { readonly children: ReactNode }) {
  const [data, setData] = useState<LudothequeData | null>(() => readCache());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Plusieurs rafraîchissements peuvent se chevaucher (ex. après un enregistrement) :
  // seule la réponse de la dernière demande est appliquée, pour ne pas réécrire des données plus récentes.
  const latestRequest = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;
    setLoading(true);
    try {
      const next = await fetchData();
      if (requestId !== latestRequest.current) return;
      setData(next);
      setError(null);
      writeCache(next);
    } catch (cause) {
      if (requestId !== latestRequest.current) return;
      setError(cause instanceof ApiError ? cause.code : 'server');
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<DataContextValue>(
    () => ({ data, loading, error, refresh }),
    [data, loading, error, refresh],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const value = useContext(DataContext);
  if (value === null) throw new Error('useData doit être utilisé dans DataProvider');
  return value;
}
