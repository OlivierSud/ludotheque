import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { JeuDraft } from '@/types';

const API_URL = 'https://api.test/exec';
const META = { token: 'tok', startedAt: 1000, website: '' };
const JEU: JeuDraft = { nom: 'Catan', lien: '', criteres: { Categorie: ['Strategie'] } };

async function loadApi(url: string = API_URL) {
  vi.resetModules();
  vi.stubEnv('VITE_API_URL', url);
  return import('@/services/api');
}

function jsonResponse(value: unknown): Response {
  return { json: async () => value } as unknown as Response;
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('configuration', () => {
  it('refuse toute requête sans VITE_API_URL', async () => {
    const api = await loadApi('');
    expect(api.apiConfigured).toBe(false);
    await expect(api.fetchData()).rejects.toMatchObject({ code: 'not_configured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('expose l’URL configurée', async () => {
    const api = await loadApi();
    expect(api.apiConfigured).toBe(true);
  });
});

describe('écriture', () => {
  it('envoie une requête simple (text/plain, sans préflight) avec le jeton', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, id: '4' }));
    const api = await loadApi();

    await expect(api.createGame(JEU, META)).resolves.toBe('4');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(API_URL);
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe(
      'text/plain;charset=utf-8',
    );
    expect(JSON.parse(String(init.body))).toEqual({
      action: 'createGame',
      token: 'tok',
      startedAt: 1000,
      website: '',
      jeu: JEU,
    });
  });

  it('transmet l’identifiant en modification', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, id: '7' }));
    const api = await loadApi();

    await api.updateGame('7', JEU, META);

    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body.action).toBe('updateGame');
    expect(body.id).toBe('7');
  });

  it('transmet le critère et le libellé pour une nouvelle option', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true, id: 'Ambiance' }));
    const api = await loadApi();

    await expect(api.createOption('Categorie', 'Ambiance', META)).resolves.toBe('Ambiance');

    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body).toMatchObject({
      action: 'createOption',
      critereId: 'Categorie',
      libelle: 'Ambiance',
    });
  });

  it('accepte une réponse sans identifiant', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    const api = await loadApi();
    await expect(api.createGame(JEU, META)).resolves.toBe('');
  });

  it.each(['captcha', 'validation', 'rate_limited', 'not_found', 'server'])(
    'remonte le code %s',
    async (code) => {
      fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: code }));
      const api = await loadApi();
      await expect(api.createGame(JEU, META)).rejects.toMatchObject({ code });
    },
  );

  it('ramène un code inconnu à « server »', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: false, error: 'owasp' }));
    const api = await loadApi();
    await expect(api.createGame(JEU, META)).rejects.toMatchObject({ code: 'server' });
  });
});

describe('lecture', () => {
  it('lit les données avec action=data', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ ok: true, jeux: [], criteres: [], couleurs: [], updatedAt: 'x' }),
    );
    const api = await loadApi();

    await expect(api.fetchData()).resolves.toMatchObject({
      jeux: [],
      criteres: [],
      updatedAt: 'x',
    });
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}?action=data`, expect.anything());
  });

  it('rejette une réponse illisible', async () => {
    fetchMock.mockResolvedValue(jsonResponse('texte'));
    const api = await loadApi();
    await expect(api.fetchData()).rejects.toMatchObject({ code: 'invalid_response' });
  });
});

describe('pannes', () => {
  it('signale une coupure réseau', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const api = await loadApi();
    await expect(api.createGame(JEU, META)).rejects.toMatchObject({ code: 'network' });
  });

  it('abandonne après 15 s', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          );
        }),
    );
    const api = await loadApi();

    const pending = api.createGame(JEU, META);
    const assertion = expect(pending).rejects.toMatchObject({ code: 'network' });
    await vi.advanceTimersByTimeAsync(15000);
    await assertion;
  });
});
