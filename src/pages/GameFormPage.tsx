/* eslint-disable react-hooks/refs */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColorKey, Jeu, JeuDraft, Option } from '@/types';
import { colorHex } from '@/lib/colors';
import { validateJeu, hasErrors, normalizeLien, type FieldErrors } from '@/lib/validation';
import { errorMessage } from '@/lib/errorMessage';
import { createGame, updateGame, createOption, type WriteMeta } from '@/services/api';
import { useData } from '@/context/DataContext';
import { useTurnstile } from '@/hooks/useTurnstile';
import { Modal } from '@/components/Modal';
import { CriteriaPicker } from '@/components/CriteriaPicker';

interface FormProps {
  readonly isNew: boolean;
  readonly existing: Jeu | null;
  readonly dataCriteres: NonNullable<ReturnType<typeof useData>['data']>['criteres'];
}

function GameForm({ isNew, existing, dataCriteres }: FormProps) {
  const { refresh } = useData();
  const navigate = useNavigate();

  const [draft, setDraft] = useState<JeuDraft>(
    existing === null
      ? { nom: '', lien: '', criteres: {} }
      : { nom: existing.nom, lien: existing.lien, criteres: existing.criteres },
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState('');
  const [website, setWebsite] = useState('');
  const [openCritereId, setOpenCritereId] = useState<string | null>(null);
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onToken = useCallback((value: string) => setToken(value), []);
  const turnstile = useTurnstile(onToken);

  const activeCritere = dataCriteres.find((c) => c.id === openCritereId) ?? null;

  const handleCreateOption = async (libelle: string, couleur: ColorKey): Promise<Option | null> => {
    if (token === '' || openCritereId === null) {
      setMessage('Merci de valider le captcha.');
      return null;
    }
    const meta: WriteMeta = { token, startedAt: startedAt.current, website };
    try {
      const option = await createOption(openCritereId, libelle, couleur, meta);
      await refresh();
      setDraft((current) => {
        const currentIds = current.criteres[openCritereId] ?? [];
        return {
          ...current,
          criteres: { ...current.criteres, [openCritereId]: [...currentIds, option.id] },
        };
      });
      turnstile.reset();
      setToken('');
      return option;
    } catch (cause) {
      setMessage(errorMessage(cause));
      turnstile.reset();
      setToken('');
      return null;
    }
  };

  const handleSave = async () => {
    const normalizedDraft: JeuDraft = {
      ...draft,
      nom: draft.nom.trim(),
      lien: normalizeLien(draft.lien),
    };
    const nextErrors = validateJeu(normalizedDraft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    if (token === '') {
      setMessage('Merci de valider le captcha.');
      return;
    }
    setSaving(true);
    setMessage(null);
    const meta: WriteMeta = { token, startedAt: startedAt.current, website };
    try {
      if (isNew) await createGame(normalizedDraft, meta);
      else if (existing !== null) await updateGame(existing.id, normalizedDraft, meta);
      await refresh();
      navigate('/liste');
    } catch (cause) {
      setMessage(errorMessage(cause));
      turnstile.reset();
      setToken('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button type="button" className="back-button" onClick={() => navigate('/liste')}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h2 className="form-header__title">{isNew ? 'Nouveau jeu' : 'Édition du jeu'}</h2>
        <button
          type="button"
          className="primary-button"
          onClick={() => void handleSave()}
          disabled={saving}
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      <div className="form-body">
        <div className="form-field">
          <label className="form-label" htmlFor="form-nom">
            Nom du jeu
          </label>
          <input
            id="form-nom"
            className="form-input form-input--large"
            value={draft.nom}
            onChange={(event) => setDraft((current) => ({ ...current, nom: event.target.value }))}
            aria-invalid={errors.nom !== undefined}
          />
          {errors.nom !== undefined && <p className="form-error">{errors.nom}</p>}
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="form-lien">
            Lien du site
          </label>
          <input
            id="form-lien"
            className="form-input"
            value={draft.lien}
            placeholder="https://www.exemple.com"
            onChange={(event) => setDraft((current) => ({ ...current, lien: event.target.value }))}
            onBlur={() =>
              setDraft((current) => ({ ...current, lien: normalizeLien(current.lien) }))
            }
            aria-invalid={errors.lien !== undefined}
          />
          {errors.lien !== undefined && <p className="form-error">{errors.lien}</p>}
        </div>

        <div className="form-card">
          {dataCriteres.map((critere) => {
            const selected = draft.criteres[critere.id] ?? [];
            const options = critere.options.filter((option) => selected.includes(option.id));
            return (
              <div className="crit-row" key={critere.id}>
                <div className="crit-row__main">
                  <span className="crit-row__label">{critere.nom}</span>
                  <span className="crit-row__values">
                    {options.length === 0 ? (
                      <span className="crit-row__empty">—</span>
                    ) : (
                      options.map((option) => (
                        <span
                          key={option.id}
                          className="tag"
                          style={{
                            backgroundColor: colorHex(option.couleur),
                            color: colorHex(option.couleur) === '#ffc222' ? '#2b2b2b' : '#ffffff',
                          }}
                        >
                          {option.libelle}
                        </span>
                      ))
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setOpenCritereId(critere.id)}
                  aria-label={`Modifier ${critere.nom}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <input
          type="text"
          className="honeypot"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="turnstile">
          {!turnstile.configured && (
            <p className="form-message form-message--info">
              Captcha non configuré (VITE_TURNSTILE_SITE_KEY manquant).
            </p>
          )}
          <div ref={turnstile.setContainer} />
          {turnstile.failed && (
            <p className="form-message form-message--error">Le captcha n'a pas pu se charger.</p>
          )}
        </div>

        {message !== null && <p className="form-message form-message--error">{message}</p>}
      </div>

      {activeCritere !== null && (
        <Modal title={`Éditer ${activeCritere.nom}`} onClose={() => setOpenCritereId(null)}>
          <CriteriaPicker
            critere={activeCritere}
            selected={draft.criteres[activeCritere.id] ?? []}
            onChange={(ids) =>
              setDraft((current) => ({
                ...current,
                criteres: { ...current.criteres, [activeCritere.id]: ids },
              }))
            }
            onCreateOption={handleCreateOption}
            canWrite={turnstile.configured && token !== ''}
          />
        </Modal>
      )}
    </div>
  );
}

export function GameFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === undefined || id === 'nouveau';
  const { data } = useData();
  const navigate = useNavigate();

  if (data === null) {
    return (
      <div className="screen__inner">
        <p className="state">Chargement…</p>
      </div>
    );
  }

  if (!isNew) {
    const existing = data.jeux.find((item) => item.id === id) ?? null;
    if (existing === null) {
      return (
        <div className="screen__inner">
          <p className="state">Jeu introuvable.</p>
          <button type="button" className="secondary-button" onClick={() => navigate('/liste')}>
            Retour
          </button>
        </div>
      );
    }
    return <GameForm isNew={false} existing={existing} dataCriteres={data.criteres} />;
  }

  return <GameForm isNew existing={null} dataCriteres={data.criteres} />;
}
