// File: components/Navbar/MegaMenu.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Genre = { id: number; name: string };
type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  imdb_id?: string;
};

type Props = {
  menuOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
};

const TMDB_API_KEY = "024c86461eb1256eaa22934b9a84ec59";

const MegaMenu: React.FC<Props> = ({ menuOpen, menuRef }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [moviesByGenre, setMoviesByGenre] = useState<
    Record<number, TMDBMovie[]>
  >({});

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        setGenres(data.genres);
      } catch (e) {
        console.error("Genres fetch failed:", e);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const abort = new AbortController();

    const fetchMoviesForGenre = async (genre: Genre) => {
      try {
        if (moviesByGenre[genre.id]) return;

        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&language=en-US&page=1`,
          { signal: abort.signal }
        );
        const data = await res.json();

        const first = data.results.slice(0, 14) as TMDBMovie[];

        const withImdb: TMDBMovie[] = await Promise.all(
          first.map(async (m) => {
            try {
              const det = await fetch(
                `https://api.themoviedb.org/3/movie/${m.id}?api_key=${TMDB_API_KEY}&language=en-US`,
                { signal: abort.signal }
              ).then((r) => r.json());
              return { ...m, imdb_id: det.imdb_id };
            } catch {
              return m;
            }
          })
        );

        setMoviesByGenre((prev) => ({ ...prev, [genre.id]: withImdb }));
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error(`Movies for genre ${genre.name} failed:`, e);
      }
    };

    genres.slice(0, 8).forEach(fetchMoviesForGenre);

    return () => abort.abort();
  }, [menuOpen, genres, moviesByGenre]);

  return (
    <div
      ref={menuRef}
      className={`px-30 absolute top-full left-0 w-screen bg-neutral-900 text-white z-40 overflow-y-auto transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        menuOpen ? "h-[100dvh] opacity-100 py-6 px-8" : "h-0 opacity-0 px-8"
      }`}
    >
      {genres.slice(0, 8).map((genre) => (
        <div key={genre.id} className="mb-10">
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <span className="text-yellow-400">▍</span>
            {genre.name}
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-yellow-500">
            {(moviesByGenre[genre.id] ?? Array(8).fill(null)).map(
              (movie, idx) =>
                movie ? (
                  <Link
                    key={movie.id}
                    to={`/movie/${movie.imdb_id ?? `tmdb-${movie.id}`}`}
                    className="w-40 flex-shrink-0"
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "https://via.placeholder.com/200x300?text=N/A"
                      }
                      alt={movie.title}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                    <p className="mt-1 text-sm">{movie.title}</p>
                  </Link>
                ) : (
                  <div
                    key={idx}
                    className="w-40 flex-shrink-0 animate-pulse bg-neutral-800 h-56 rounded-lg"
                  />
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MegaMenu;
