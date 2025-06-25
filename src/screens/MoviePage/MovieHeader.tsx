// File: components/MoviePage/MovieHeader.tsx

import React from "react";
import { motion } from "framer-motion";
import type { MovieDetail } from "./types";
import AddToPlaylistPanel from "../../components/AddToPlaylistPanel";

interface Props {
  movie: MovieDetail;
}

const MovieHeader: React.FC<Props> = ({ movie }) => {
  return (
    <div className="relative px-4 md:px-30 min-h-[60vh] md:h-[60vh] w-full">
      {/* Pozadí obrázku + rozmazání */}
      <motion.img
        key={`${movie.Poster}-blur`}
        src={movie.Poster}
        alt="Backdrop"
        className="absolute inset-0 w-full h-full object-cover  blur-lg opacity-30"
        initial={{ scale: 1.0, opacity: 0 }}
        animate={{ scale: 1.0, opacity: 0.3 }}
        transition={{ duration: 0.8 }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />

      {/* Obsah */}
      <div className="relative z-10 mx-auto h-full flex flex-col md:flex-row items-center gap-10 py-8">
        {/* ...zbytek beze změny */}

        <div className="relative">
          <motion.img
            key={movie.Poster}
            src={movie.Poster}
            alt={movie.Title}
            className="sm:w-56 md:w-64 lg:w-72 rounded-xl shadow-lg border-4 border-yellow-400/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />

          {/* Tlačítko v rohu obrázku */}
          <div className="absolute top-2 left-2 z-20">
            <AddToPlaylistPanel
              movie={{
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year,
              }}
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {movie.Title}
            <span className="text-yellow-300 ml-3 opacity-80">
              ({movie.Year})
            </span>
          </h1>
          <p className="text-sm md:text-base text-yellow-200/90">
            {movie.Genre} · {movie.Runtime} · {movie.Rated}
          </p>
          <p className="max-w-prose mx-auto md:mx-0 text-sm md:text-base text-yellow-100/80 leading-relaxed">
            {movie.Plot}
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2 text-xs md:text-sm">
            <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-full px-3 py-1">
              <span className="font-bold">Director:</span> {movie.Director}
            </div>
            <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-full px-3 py-1">
              <span className="font-bold">Cast:</span> {movie.Actors}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-3 text-xs">
            {movie.Language.split(",").map((lang) => (
              <span
                key={lang.trim()}
                className="bg-yellow-400/20 px-2 py-0.5 rounded-full border border-yellow-400/40 text-yellow-200/90"
              >
                {lang.trim()}
              </span>
            ))}
            {movie.Country.split(",").map((c) => (
              <span
                key={c.trim()}
                className="bg-yellow-600/20 px-2 py-0.5 rounded-full border border-yellow-600/40 text-yellow-200/90"
              >
                {c.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
