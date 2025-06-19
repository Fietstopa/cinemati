// File: components/MoviePage/useMovieData.ts

import { useEffect, useState } from "react";
import type { MovieDetail } from "./types";
import type { RatingPoint } from "./types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

// helper pro prevedeni hodnoty z ruznych formatu na cislo (napr. 7.5/10 -> 75%)
const parseRatings = (ratings: MovieDetail["Ratings"]): RatingPoint[] => {
  const toNumber = (val: string): number => {
    if (val.includes("/")) {
      const [n, d] = val.split("/").map(Number);
      return Number.isFinite(n) && Number.isFinite(d) ? (n / d) * 100 : 0;
    }
    if (val.includes("%")) return parseFloat(val);
    return 0;
  };
  return ratings.map((r) => ({ source: r.Source, value: toNumber(r.Value) }));
};

const useMovieData = (imdbID: string | undefined) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveCount, setSaveCount] = useState<number | null>(null);

  // fetchni data o filmu z OMDb API
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=fdc04ec6`
        );
        const data = await res.json();
        if (data.Response === "True") setMovie(data as MovieDetail);
      } finally {
        setLoading(false);
      }
    };
    if (imdbID) fetchMovie();
  }, [imdbID]);

  // sleduj saveCount z Firebase
  useEffect(() => {
    if (!movie?.imdbID) return;
    const ref = doc(db, "movies", movie.imdbID);
    const unsub = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSaveCount(data.saveCount || 0);
      }
    });
    return () => unsub();
  }, [movie?.imdbID]);

  // priprav data pro graf s ratingama (IMDb, Metascore, ostatni)
  const ratingData = movie ? parseRatings(movie.Ratings) : [];

  const imdbScore = parseFloat(movie?.imdbRating || "0");
  const imdbGauge = [
    { name: "Rating", value: imdbScore * 10 },
    { name: "Remaining", value: 100 - imdbScore * 10 },
  ];

  const metaScore = parseFloat(movie?.Metascore || "0");
  const metaGauge = [
    { name: "Metascore", value: metaScore },
    { name: "Remaining", value: 100 - metaScore },
  ];

  // priprav statistiky pro grid s ikonama
  const stats = movie
    ? [
        {
          icon: "attach_money",
          label: "Box Office",
          value: movie.BoxOffice || "N/A",
        },
        { icon: "schedule", label: "Runtime", value: movie.Runtime },
        { icon: "people", label: "IMDb Votes", value: movie.imdbVotes },
        { icon: "emoji_events", label: "Awards", value: movie.Awards || "—" },
        {
          icon: "bookmark_added",
          label: "Saved by Users",
          value: saveCount !== null ? `${saveCount}x` : "Was not saved",
        },
      ]
    : [];

  // vrat vse co komponenta potrebuje
  return {
    movie,
    loading,
    ratingData,
    imdbGauge,
    metaGauge,
    imdbScore: movie?.imdbRating || "N/A",
    metaScore: movie?.Metascore || "N/A",
    stats,
    saveCount,
  };
};

export default useMovieData;
