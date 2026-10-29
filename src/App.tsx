import { useMemo, useState } from 'react';
import { CategoryFilterBar } from '@/components/CategoryFilterBar';
import { GameCard } from '@/components/GameCard';
import { ReloadPrompt } from '@/components/ReloadPrompt';
import { games } from '@/data/games';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { filterGames, formatGameCount, type CategoryFilter } from '@/lib/games';

const FAVORITES_KEY = 'ludotheque:favorites';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Toutes');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useLocalStorage<readonly string[]>(FAVORITES_KEY, []);

  const favorites = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const visibleGames = useMemo(
    () => filterGames(games, { query, category, favoritesOnly, favorites }),
    [query, category, favoritesOnly, favorites],
  );

  const toggleFavorite = (id: string) => {
    setFavoriteIds((previous) =>
      previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id],
    );
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="hero__eyebrow">Ma collection</p>
        <h1 className="hero__title">Ludothèque</h1>
        <p className="hero__subtitle">
          {formatGameCount(games.length)} · {favoriteIds.length} favori
          {favoriteIds.length > 1 ? 's' : ''}
        </p>
      </header>

      <main className="main">
        <section className="toolbar" aria-label="Recherche et filtres">
          <div className="search">
            <label className="search__label" htmlFor="game-search">
              Rechercher un jeu
            </label>
            <input
              id="game-search"
              className="search__input"
              type="search"
              placeholder="Titre, tag, catégorie…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>

          <CategoryFilterBar value={category} onChange={setCategory} />

          <label className="switch">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(event) => setFavoritesOnly(event.target.checked)}
            />
            <span>Favoris uniquement</span>
          </label>
        </section>

        <p className="results" aria-live="polite">
          {formatGameCount(visibleGames.length)}
        </p>

        {visibleGames.length === 0 ? (
          <p className="empty">
            Aucun jeu ne correspond à votre recherche. Essayez un autre mot-clé ou retirez les
            filtres.
          </p>
        ) : (
          <ul className="grid">
            {visibleGames.map((game) => (
              <li key={game.id}>
                <GameCard
                  game={game}
                  isFavorite={favorites.has(game.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="footer">
        <p>Ludothèque — application web progressive, installable et hors ligne.</p>
      </footer>

      <ReloadPrompt />
    </div>
  );
}
