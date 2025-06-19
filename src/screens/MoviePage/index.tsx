// File: components/MoviePage/index.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import CommentSection from "@/components/CommentSection";
import useMovieData from "./useMovieData";
import MovieHeader from "./MovieHeader";
import MovieInsights from "./MovieInsights";

const MoviePage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const { movie, loading, ratingData, imdbGauge, metaGauge, stats, saveCount } =
    useMovieData(imdbID);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-yellow-300">
        <div className="w-20 h-20 mb-4 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xl font-semibold">Loading movie…</p>
      </div>
    );

  if (!movie)
    return (
      <div className="text-center text-red-400 py-24">Movie not found.</div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-black text-yellow-400"
    >
      <MovieHeader movie={movie} />
      <MovieInsights
        stats={stats}
        ratingData={ratingData}
        imdbGauge={imdbGauge}
        metaGauge={metaGauge}
        imdbScore={movie.imdbRating}
        metaScore={movie.Metascore}
      />

      <CommentSection imdbID={movie.imdbID} />
    </motion.div>
  );
};

export default MoviePage;
