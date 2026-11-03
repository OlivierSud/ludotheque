import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearSiteData } from './clearSiteData';

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe('clearSiteData', () => {
  it('supprime les clés de l’application sans toucher aux autres', async () => {
    window.localStorage.setItem('ludotheque:data:v1', '{}');
    window.localStorage.setItem('autre', 'garder');

    await clearSiteData();

    expect(window.localStorage.getItem('ludotheque:data:v1')).toBeNull();
    expect(window.localStorage.getItem('autre')).toBe('garder');
  });

  it('supprime tous les caches du navigateur', async () => {
    const remove = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('caches', {
      keys: vi.fn().mockResolvedValue(['precache', 'ludotheque-api']),
      delete: remove,
    });

    await clearSiteData();

    expect(remove).toHaveBeenCalledTimes(2);
  });

  it('désenregistre les service workers', async () => {
    const unregister = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('navigator', {
      serviceWorker: {
        getRegistrations: vi.fn().mockResolvedValue([{ unregister }, { unregister }]),
      },
    });

    await clearSiteData();

    expect(unregister).toHaveBeenCalledTimes(2);
  });
});
