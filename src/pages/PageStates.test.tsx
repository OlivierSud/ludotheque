import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { LudothequeData } from '@/types';

const h = vi.hoisted(() => ({
  refresh: vi.fn(async () => {}),
  data: null as LudothequeData | null,
  loading: false,
  error: null as string | null,
  selection: {} as Record<string, readonly string[]>,
  clear: vi.fn(),
}));

vi.mock('@/context/DataContext', () => ({
  useData: () => ({ data: h.data, loading: h.loading, error: h.error, refresh: h.refresh }),
}));

vi.mock('@/context/FiltersContext', () => ({
  useFilters: () => ({
    selection: h.selection,
    toggle: vi.fn(),
    clear: h.clear,
    activeCount: Object.values(h.selection).filter((ids) => ids.length > 0).length,
  }),
}));

const { HomePage } = await import('@/pages/HomePage');
const { DatabasePage } = await import('@/pages/DatabasePage');

const DATA: LudothequeData = {
  jeux: [{ id: '2', nom: 'Catan', lien: '', criteres: {} }],
  criteres: [],
  couleurs: [],
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function renderPage(node: React.ReactNode) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

beforeEach(() => {
  h.data = null;
  h.loading = false;
  h.error = null;
  h.selection = {};
  h.refresh.mockClear();
});

describe('HomePage — états de chargement', () => {
  it('affiche « Chargement… » tant que les données arrivent', () => {
    h.loading = true;
    renderPage(<HomePage />);
    expect(screen.getByText('Chargement…')).toBeTruthy();
  });

  it('affiche une erreur et un bouton Réessayer sans données', async () => {
    h.error = 'network';
    const user = userEvent.setup();
    renderPage(<HomePage />);

    expect(screen.getByText('Impossible de charger la ludothèque.')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(h.refresh).toHaveBeenCalledTimes(1);
  });

  it('affiche un bandeau hors ligne quand des données en cache existent', () => {
    h.error = 'network';
    h.data = DATA;
    renderPage(<HomePage />);
    expect(screen.getByRole('status').textContent).toContain('Données hors ligne');
    expect(screen.getByText('Catan')).toBeTruthy();
  });

  it('affiche un état vide explicite sans aucun jeu', () => {
    h.data = { ...DATA, jeux: [] };
    renderPage(<HomePage />);
    expect(screen.getByText(/Aucun jeu/)).toBeTruthy();
  });
});

describe('DatabasePage — états', () => {
  it('affiche « Chargement… » sans données', () => {
    renderPage(<DatabasePage />);
    expect(screen.getByText('Chargement…')).toBeTruthy();
  });

  it('ne propose ni message ni nouvelle tentative quand l’API échoue', () => {
    h.error = 'network';
    renderPage(<DatabasePage />);
    // Défaut connu : l’écran reste bloqué sur « Chargement… ».
    expect(screen.getByText('Chargement…')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Réessayer' })).toBeNull();
    expect(screen.queryByText(/Impossible/)).toBeNull();
  });

  it('affiche la liste avec le bouton Nouveau jeu', () => {
    h.data = DATA;
    renderPage(<DatabasePage />);
    expect(screen.getByRole('button', { name: 'Ajouter un jeu' })).toBeTruthy();
    expect(screen.getByText('Catan')).toBeTruthy();
  });
});
