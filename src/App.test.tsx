import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('affiche la collection complète', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ludothèque' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(9);
  });

  it('filtre les jeux via la recherche', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Rechercher un jeu'), 'azul');

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(within(articles[0]!).getByRole('heading', { name: 'Azul' })).toBeInTheDocument();
  });

  it('filtre par catégorie', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Coopératif' }));

    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('ajoute un jeu aux favoris et persiste le choix', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ajouter Azul aux favoris' }));

    expect(screen.getByRole('button', { name: 'Retirer Azul des favoris' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(window.localStorage.getItem('ludotheque:favorites')).toBe('["azul"]');
  });

  it('n’affiche que les favoris quand le filtre est actif', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ajouter Azul aux favoris' }));
    await user.click(screen.getByRole('checkbox', { name: 'Favoris uniquement' }));

    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
