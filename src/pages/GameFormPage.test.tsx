import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { LudothequeData } from '@/types';

const h = vi.hoisted(() => ({
  emitToken: true,
  reset: vi.fn(),
  refresh: vi.fn(async () => {}),
  createGame: vi.fn(),
  updateGame: vi.fn(),
  createOption: vi.fn(),
  data: {
    jeux: [
      { id: '2', nom: 'Catan', lien: 'https://catan.com', criteres: { Categorie: ['Strategie'] } },
    ],
    criteres: [
      {
        id: 'Categorie',
        nom: 'Categorie',
        ordre: 1,
        multiple: true,
        options: [
          { id: 'Strategie', libelle: 'Strategie', couleur: 'olive', ordre: 1 },
          { id: 'Ambiance', libelle: 'Ambiance', couleur: 'blue', ordre: 2 },
        ],
      },
    ],
    couleurs: [],
    updatedAt: '2026-01-01T00:00:00.000Z',
  } as LudothequeData,
}));

vi.mock('@/context/DataContext', () => ({
  useData: () => ({
    data: h.data,
    loading: false,
    error: null,
    refresh: h.refresh,
  }),
}));

vi.mock('@/hooks/useTurnstile', async () => {
  const { useEffect } = await import('react');
  return {
    useTurnstile: (onToken: (token: string) => void) => {
      useEffect(() => {
        if (h.emitToken) onToken('jeton-test');
      }, [onToken]);
      return {
        setContainer: () => {},
        configured: h.emitToken,
        ready: true,
        failed: false,
        reset: h.reset,
      };
    },
  };
});

vi.mock('@/services/api', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createGame: h.createGame,
  updateGame: h.updateGame,
  createOption: h.createOption,
}));

const { GameFormPage } = await import('@/pages/GameFormPage');
const { ApiError } = await import('@/services/api');
const { UnsavedChangesProvider } = await import('@/context/UnsavedChangesContext');

function renderForm(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <UnsavedChangesProvider>
        <Routes>
          <Route path="/jeu/nouveau" element={<GameFormPage />} />
          <Route path="/jeu/:id" element={<GameFormPage />} />
          <Route path="/liste" element={<p>liste des jeux</p>} />
        </Routes>
      </UnsavedChangesProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  h.emitToken = true;
  h.createGame.mockReset().mockResolvedValue('9');
  h.updateGame.mockReset().mockResolvedValue(undefined);
  h.refresh.mockReset().mockResolvedValue(undefined);
  h.reset.mockReset();
});

describe('bouton Enregistrer de l’en-tête', () => {
  it('crée un jeu puis revient à la liste', async () => {
    const user = userEvent.setup();
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), '  Catan  ');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(h.createGame).toHaveBeenCalledTimes(1);
    expect(h.createGame).toHaveBeenCalledWith(
      expect.objectContaining({ nom: 'Catan' }),
      expect.objectContaining({ token: 'jeton-test' }),
    );
    expect(h.refresh).toHaveBeenCalled();
    expect(await screen.findByText('liste des jeux')).toBeTruthy();
  });

  it('modifie un jeu existant avec son identifiant', async () => {
    const user = userEvent.setup();
    renderForm('/jeu/2');

    await user.type(screen.getByLabelText('Nom du jeu'), ' (2)');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(h.updateGame).toHaveBeenCalledTimes(1);
    expect(h.updateGame).toHaveBeenCalledWith(
      '2',
      expect.objectContaining({ nom: 'Catan (2)' }),
      expect.objectContaining({ token: 'jeton-test' }),
    );
    expect(await screen.findByText('liste des jeux')).toBeTruthy();
  });

  it('bloque un nom vide sans appeler l’API', async () => {
    const user = userEvent.setup();
    renderForm('/jeu/nouveau');

    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(h.createGame).not.toHaveBeenCalled();
    expect(screen.getByText('Le nom du jeu est obligatoire.')).toBeTruthy();
    expect(screen.queryByText('liste des jeux')).toBeNull();
  });

  it('reste sur le formulaire et explique l’échec', async () => {
    const user = userEvent.setup();
    h.createGame.mockRejectedValue(new ApiError('captcha'));
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), 'Catan');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(await screen.findByText('La vérification anti-robot a échoué. Réessayez.')).toBeTruthy();
    expect(screen.queryByText('liste des jeux')).toBeNull();
    expect(h.reset).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Enregistrer' })).toHaveProperty('disabled', false);
  });

  it('refuse d’envoyer sans jeton captcha', async () => {
    const user = userEvent.setup();
    h.emitToken = false;
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), 'Catan');
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(h.createGame).not.toHaveBeenCalled();
    expect(screen.getByText('Merci de valider le captcha.')).toBeTruthy();
  });
});

describe('popup « modifications non enregistrées »', () => {
  it('enregistre depuis la popup puis quitte', async () => {
    const user = userEvent.setup();
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), 'Catan');
    await user.click(screen.getByRole('button', { name: 'Retour' }));

    const modal = screen.getByRole('dialog', { name: 'Modifications non enregistrées' });
    await user.click(within(modal).getByRole('button', { name: 'Enregistrer' }));

    expect(h.createGame).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('liste des jeux')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('garde la popup ouverte si l’enregistrement échoue', async () => {
    const user = userEvent.setup();
    h.createGame.mockRejectedValue(new ApiError('server'));
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), 'Catan');
    await user.click(screen.getByRole('button', { name: 'Retour' }));

    const modal = screen.getByRole('dialog', { name: 'Modifications non enregistrées' });
    await user.click(within(modal).getByRole('button', { name: 'Enregistrer' }));

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'Modifications non enregistrées' })).toBeTruthy();
    expect(screen.queryByText('liste des jeux')).toBeNull();
    expect(screen.getByText('Une erreur serveur est survenue.')).toBeTruthy();
  });

  it('sort sans enregistrer', async () => {
    const user = userEvent.setup();
    renderForm('/jeu/nouveau');

    await user.type(screen.getByLabelText('Nom du jeu'), 'Catan');
    await user.click(screen.getByRole('button', { name: 'Retour' }));
    await user.click(screen.getByRole('button', { name: 'Sortir sans enregistrer' }));

    expect(h.createGame).not.toHaveBeenCalled();
    expect(await screen.findByText('liste des jeux')).toBeTruthy();
  });
});
