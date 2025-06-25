import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { ChevronLeft, ChevronRight, Heart, Bookmark, Play } from "lucide-react";
import PopularActors from "@/components/PopularActors";
const TMDB_API_KEY = "024c86461eb1256eaa22934b9a84ec59";

// === Firestore helper ===
const getSavedCount = async (imdbID: string): Promise<number> => {
  try {
    const ref = doc(db, "movies", imdbID);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data()?.saveCount ?? 0 : 0;
  } catch (error) {
    console.error("Error getting save count:", error);
    return 0;
  }
};

// === Types ===
type Movie = {
  imdbID: string; // používáme jako klíč v URL
  title: string;
  description: string;
  image: string;
  runtime: string;
  savedCount: number;
  hearts: number;
  trailerUrl: string;
};

// === Component ===
const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [current, setCurrent] = useState(0);

  /* ──────────────────────────────
     FETCH 4 náhodných NOVÝCH filmů
  ────────────────────────────── */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 1) Aktuálně hrané filmy
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        const pool = data.results as any[];

        //4 nahodne filmy
        const chosen: any[] = [];
        while (chosen.length < 4 && pool.length) {
          const idx = Math.floor(Math.random() * pool.length);
          chosen.push(pool.splice(idx, 1)[0]);
        }

        // 3) Detail k nim (kvůli imdb_id, runtime)
        const detailed = await Promise.all(
          chosen.map(async (m) => {
            const det = await fetch(
              `https://api.themoviedb.org/3/movie/${m.id}?api_key=${TMDB_API_KEY}&language=en-US`
            ).then((r) => r.json());

            const imdbID = det.imdb_id || `tmdb-${m.id}`;
            return {
              imdbID,
              title: det.title,
              description: `${det.title} (${
                det.release_date?.slice(0, 4) ?? "N/A"
              })`,
              image: m.poster_path
                ? `https://image.tmdb.org/t/p/w780${m.poster_path}`
                : "https://source.unsplash.com/800x1200?cinema",
              runtime: det.runtime ? `${det.runtime} min` : "N/A",
              savedCount: await getSavedCount(imdbID),
              hearts: Math.floor(Math.random() * 200) + 50,
              trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${det.title} trailer`
              )}`,
            } as Movie;
          })
        );

        setMovies(detailed);
      } catch (err) {
        console.error("TMDb fetch error:", err);
      }
    };

    fetchMovies();
  }, []);

  if (!movies.length) {
    return (
      <div className="min-h-screen items-center flex flex-col justify-center bg-black text-yellow-50 text-4xl font-medium">
        <iframe
          src="https://giphy.com/embed/3y0oCOkdKKRi0"
          width="100%"
          height="100%"
          frameBorder="0"
          className="giphy-embed"
          allowFullScreen
        ></iframe>
        🍿 Loading personalized recommendations…
      </div>
    );
  }

  /* ──────────────────────────────
     CAROUSEL LOGIC
  ────────────────────────────── */
  const show = movies[current];
  const nextList = [1, 2, 3].map((i) => movies[(current + i) % movies.length]);
  const cycle = (dir: 1 | -1) =>
    setCurrent((i) => (i + dir + movies.length) % movies.length);

  /* ──────────────────────────────
     RENDER
  ────────────────────────────── */
  return (
    <>
      {/* === Blurred background === */}
      <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
        <img
          src={show.image}
          alt=""
          className="w-full h-full object-cover scale-110 blur-lg brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* === Layout === */}
      <div className="relative min-h-[calc(100vh-60px)] flex flex-col lg:flex-row gap-10 px-4 md:px-10 lg:px-30 py-4 md:py-12 text-yellow-50 overflow-hidden">
        {/* === Hero === */}
        <div className="relative w-full lg:w-2/3 aspect-[3/4] md:aspect-[21/9] overflow-hidden rounded-2xl shadow-xl ring-1 ring-yellow-500/10">
          <Link to={`/movie/${show.imdbID}`} className="block w-full h-full">
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={show.imdbID}
                src={show.image}
                alt={show.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-8 left-10 z-10 max-w-[70%]">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                {show.description}
              </h2>
              <p className="text-yellow-300 text-sm mt-2 uppercase font-semibold">
                New in Cinemas
              </p>
              <div className="flex items-center gap-3 mt-4 text-xs font-medium">
                <span className="flex items-center gap-1 bg-yellow-400/20 px-2 py-0.5 rounded-full">
                  <Bookmark className="w-4 h-4" /> {show.savedCount}
                </span>
                <span className="flex items-center gap-1 bg-pink-400/20 px-2 py-0.5 rounded-full">
                  <Heart className="w-4 h-4" /> {show.hearts}
                </span>
                <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                  ⏱ {show.runtime}
                </span>
              </div>
            </div>
          </Link>

          {/* Arrow buttons */}
          <button
            onClick={() => cycle(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-yellow-400 text-black hover:bg-yellow-300 p-3 rounded-full shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => cycle(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-yellow-400 text-black hover:bg-yellow-300 p-3 rounded-full shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* === Up next === */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h3 className="text-yellow-400 text-xl font-bold mb-2">Up next</h3>
          <div className="flex flex-col gap-4 overflow-y-auto pr-1 max-h-[75vh]">
            {nextList.map((m) => (
              <Link
                key={m.imdbID}
                to={`/movie/${m.imdbID}`}
                className="group flex bg-neutral-900/70 hover:bg-neutral-800/90 transition rounded-xl overflow-hidden ring-1 ring-yellow-400/10"
              >
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-24 object-cover group-hover:scale-[1.03] transition"
                />
                <div className="p-3 flex flex-col justify-between flex-1">
                  <a
                    href={m.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:text-yellow-600 text-base"
                  >
                    <Play className="w-5 h-5" /> Trailer
                  </a>

                  <p className="text-lg font-semibold line-clamp-2">
                    {m.description}
                  </p>
                  <div className="flex gap-3 items-center text-base text-yellow-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-4 h-4" /> {m.savedCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {m.hearts}
                    </span>
                    <span className="bg-yellow-400/20 border border-yellow-300/30 rounded-full px-2">
                      ⏱ {m.runtime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <PopularActors />
    </>
  );
};

export default HomePage;
