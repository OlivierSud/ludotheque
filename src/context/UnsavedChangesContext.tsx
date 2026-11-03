/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/Modal';

export interface UnsavedGuard {
  readonly isDirty: () => boolean;
  /** Enregistre le brouillon ; renvoie `true` si l'écriture a réussi. */
  readonly save: () => Promise<boolean>;
}

interface UnsavedChangesValue {
  /** Navigue, sauf si un formulaire en cours bloque pour proposer d'enregistrer. */
  readonly attemptNavigate: (to: string) => void;
  readonly register: (guard: UnsavedGuard) => () => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesValue | null>(null);

export function UnsavedChangesProvider({ children }: { readonly children: ReactNode }) {
  const navigate = useNavigate();
  const guardRef = useRef<UnsavedGuard | null>(null);
  const [pendingTo, setPendingTo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const register = useCallback((guard: UnsavedGuard) => {
    guardRef.current = guard;
    return () => {
      if (guardRef.current === guard) guardRef.current = null;
    };
  }, []);

  const attemptNavigate = useCallback(
    (to: string) => {
      const guard = guardRef.current;
      if (guard !== null && guard.isDirty()) {
        setPendingTo(to);
        return;
      }
      navigate(to);
    },
    [navigate],
  );

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (guardRef.current?.isDirty() === true) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const close = useCallback(() => {
    setPendingTo(null);
    setSaveError(null);
  }, []);

  const saveAndGo = async () => {
    const guard = guardRef.current;
    if (guard === null || pendingTo === null) return;
    setSaving(true);
    setSaveError(null);
    const saved = await guard.save();
    setSaving(false);
    if (saved) {
      setPendingTo(null);
      navigate(pendingTo);
      return;
    }
    // On garde la popup ouverte : la fermer donnerait l'illusion d'une sauvegarde.
    setSaveError(
      "L'enregistrement a échoué. Fermez cette fenêtre pour voir le détail dans le formulaire, puis réessayez.",
    );
  };

  const goWithoutSaving = () => {
    const to = pendingTo;
    setPendingTo(null);
    setSaveError(null);
    if (to !== null) navigate(to);
  };

  const value = useMemo<UnsavedChangesValue>(
    () => ({ attemptNavigate, register }),
    [attemptNavigate, register],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      {pendingTo !== null && (
        <Modal title="Modifications non enregistrées" onClose={close}>
          <p className="modal__text">
            Ce jeu contient des modifications non enregistrées. Voulez-vous les enregistrer avant de
            quitter ?
          </p>
          {saveError !== null && (
            <p className="form-message form-message--error" role="alert">
              {saveError}
            </p>
          )}
          <div className="modal__actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => void saveAndGo()}
              disabled={saving}
            >
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={goWithoutSaving}
              disabled={saving}
            >
              Sortir sans enregistrer
            </button>
          </div>
        </Modal>
      )}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges(): UnsavedChangesValue {
  const value = useContext(UnsavedChangesContext);
  if (value === null) {
    throw new Error('useUnsavedChanges doit être utilisé dans UnsavedChangesProvider');
  }
  return value;
}
