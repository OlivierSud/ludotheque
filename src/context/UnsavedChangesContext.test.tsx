import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { UnsavedChangesProvider, useUnsavedChanges } from '@/context/UnsavedChangesContext';

function Harness({ save }: { readonly save: () => Promise<boolean> }) {
  const { register, attemptNavigate } = useUnsavedChanges();
  useEffect(() => register({ isDirty: () => true, save }), [register, save]);
  return (
    <button type="button" onClick={() => attemptNavigate('/sortie')}>
      Quitter
    </button>
  );
}

function renderHarness(save: () => Promise<boolean>) {
  return render(
    <MemoryRouter initialEntries={['/form']}>
      <UnsavedChangesProvider>
        <Routes>
          <Route path="/form" element={<Harness save={save} />} />
          <Route path="/sortie" element={<p>page de sortie</p>} />
        </Routes>
      </UnsavedChangesProvider>
    </MemoryRouter>,
  );
}

const dialog = () => screen.getByRole('dialog', { name: 'Modifications non enregistrées' });

describe('modifications non enregistrées', () => {
  it('enregistre puis quitte quand l’écriture réussit', async () => {
    const user = userEvent.setup();
    const save = vi.fn(async () => true);
    renderHarness(save);

    await user.click(screen.getByRole('button', { name: 'Quitter' }));
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(save).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('page de sortie')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('reste ouverte et affiche une erreur quand l’écriture échoue', async () => {
    const user = userEvent.setup();
    const save = vi.fn(async () => false);
    renderHarness(save);

    await user.click(screen.getByRole('button', { name: 'Quitter' }));
    await user.click(screen.getByRole('button', { name: 'Enregistrer' }));

    expect(dialog()).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain("L'enregistrement a échoué");
    expect(screen.queryByText('page de sortie')).toBeNull();
  });

  it('permet de sortir sans enregistrer', async () => {
    const user = userEvent.setup();
    const save = vi.fn(async () => true);
    renderHarness(save);

    await user.click(screen.getByRole('button', { name: 'Quitter' }));
    await user.click(screen.getByRole('button', { name: 'Sortir sans enregistrer' }));

    expect(save).not.toHaveBeenCalled();
    expect(await screen.findByText('page de sortie')).toBeTruthy();
  });
});
