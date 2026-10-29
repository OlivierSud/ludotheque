import { GAME_CATEGORIES } from '@/types';
import type { CategoryFilter } from '@/lib/games';

interface CategoryFilterProps {
  readonly value: CategoryFilter;
  readonly onChange: (value: CategoryFilter) => void;
}

const OPTIONS: readonly CategoryFilter[] = ['Toutes', ...GAME_CATEGORIES];

export function CategoryFilterBar({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="chips" role="group" aria-label="Filtrer par catégorie">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="chip"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
