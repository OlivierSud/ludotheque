import { useState } from 'react';
import type { ColorKey, Critere, Option } from '@/types';
import { PALETTE } from '@/types';
import { colorHex } from '@/lib/colors';

interface CriteriaPickerProps {
  readonly critere: Critere;
  readonly selected: readonly string[];
  readonly onChange: (ids: readonly string[]) => void;
  readonly onCreateOption: (libelle: string, couleur: ColorKey) => Promise<Option | null>;
  readonly canWrite: boolean;
}

export function CriteriaPicker({
  critere,
  selected,
  onChange,
  onCreateOption,
  canWrite,
}: CriteriaPickerProps) {
  const [adding, setAdding] = useState(false);
  const [libelle, setLibelle] = useState('');
  const [couleur, setCouleur] = useState<ColorKey>('teal');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (optionId: string) => {
    if (critere.multiple) {
      onChange(
        selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      );
      return;
    }
    onChange(selected.includes(optionId) ? [] : [optionId]);
  };

  const submit = async () => {
    const value = libelle.trim();
    if (value.length === 0) {
      setError("Le libellé de l'option est obligatoire.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await onCreateOption(value, couleur);
      if (created !== null) {
        onChange(critere.multiple ? [...selected, created.id] : [created.id]);
        setLibelle('');
        setAdding(false);
      }
    } catch {
      setError("L'option n'a pas pu être ajoutée.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="picker">
      <div className="picker__options">
        {critere.options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <label
              key={option.id}
              className={active ? 'picker__row picker__row--active' : 'picker__row'}
            >
              <span className="picker__row-label">
                <span
                  className="picker__dot"
                  style={{ backgroundColor: colorHex(option.couleur) }}
                  aria-hidden="true"
                />
                {option.libelle}
              </span>
              <input
                type={critere.multiple ? 'checkbox' : 'radio'}
                name={critere.id}
                checked={active}
                onChange={() => toggle(option.id)}
              />
            </label>
          );
        })}
      </div>

      {adding ? (
        <form
          className="picker__add"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <input
            className="picker__add-input"
            value={libelle}
            maxLength={40}
            placeholder="Nouvelle option"
            aria-label="Libellé de la nouvelle option"
            onChange={(event) => setLibelle(event.target.value)}
          />
          <select
            className="picker__add-color"
            value={couleur}
            aria-label="Couleur de la nouvelle option"
            onChange={(event) => setCouleur(event.target.value as ColorKey)}
          >
            {PALETTE.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <button type="submit" className="picker__add-submit" disabled={busy}>
            {busy ? '…' : 'Ajouter'}
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="picker__plus"
          onClick={() => setAdding(true)}
          disabled={!canWrite}
          title={canWrite ? 'Ajouter une option' : 'Captcha indisponible'}
          aria-label="Ajouter une option"
        >
          +
        </button>
      )}

      {error !== null && <p className="picker__error">{error}</p>}
      <p className="picker__hint">
        {critere.multiple ? 'Plusieurs valeurs possibles' : 'Une seule valeur possible'}
      </p>
    </div>
  );
}
