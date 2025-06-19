import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Types --------------------------------------------------------------------
 */
type ActorDetail = {
  name: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  profile_path: string | null;
};

type Credit = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
};

/**
 * Constants ----------------------------------------------------------------
 */
const TMDB_API_KEY = "024c86461eb1256eaa22934b9a84ec59";
const WORD_LIMIT = 100; // maximum words to show before clipping biography

/**
 * Component ----------------------------------------------------------------
 */
const ActorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [actor, setActor] = useState<ActorDetail | null>(null);
  const [credits, setCredits] = useState<
    { imdbID: string; poster: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  /** ----------------------------------------------------------------------
   * Data Fetching
   * ---------------------------------------------------------------------*/
  useEffect(() => {
    const fetchActor = async () => {
      try {
        const [detailRes, creditRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${TMDB_API_KEY}&language=en-US`
          ),
        ]);

        const detail = await detailRes.json();
        const creditData = await creditRes.json();

        setActor(detail);

        const cast = creditData.cast
          .filter((c: Credit) => c.poster_path && c.media_type === "movie")
          .slice(0, 20);

        const enriched = await Promise.all(
          cast.map(async (c: Credit) => {
            try {
              const movieRes = await fetch(
                `https://api.themoviedb.org/3/movie/${c.id}?api_key=${TMDB_API_KEY}&language=en-US`
              );
              const movie = await movieRes.json();
              return {
                imdbID: movie.imdb_id || `tmdb-${c.id}`,
                poster: c.poster_path
                  ? `https://image.tmdb.org/t/p/w300${c.poster_path}`
                  : "https://via.placeholder.com/200x300?text=N/A",
                title: c.title || c.name || "Untitled",
              };
            } catch {
              return null;
            }
          })
        );

        setCredits(enriched.filter((c): c is NonNullable<typeof c> => !!c));
      } catch (err) {
        console.error("Failed to fetch actor details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchActor();
  }, [id]);

  /** ----------------------------------------------------------------------
   * Helpers
   * ---------------------------------------------------------------------*/
  const toggleBio = () => setShowFullBio((prev) => !prev);

  const renderBiography = (bio: string | undefined) => {
    if (!bio || bio.trim().length === 0) {
      return (
        <p className="text-base leading-relaxed text-yellow-100">
          No biography available.
        </p>
      );
    }

    const words = bio.trim().split(/\s+/);

    if (words.length <= WORD_LIMIT) {
      return (
        <p className="text-base leading-relaxed text-yellow-100 whitespace-pre-line">
          {bio}
        </p>
      );
    }

    const shortened = words.slice(0, WORD_LIMIT).join(" ") + "…";

    return (
      <>
        <p className="text-base leading-relaxed text-yellow-100 whitespace-pre-line">
          {showFullBio ? bio : shortened}
        </p>
        <button
          onClick={toggleBio}
          className="mt-2 text-yellow-300 underline text-sm hover:text-yellow-200"
        >
          {showFullBio ? "Show less" : "Show more"}
        </button>
      </>
    );
  };

  /** ----------------------------------------------------------------------
   * Render
   * ---------------------------------------------------------------------*/
  if (loading || !actor) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white text-2xl">
        Loading actor details...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-30 bg-black text-yellow-50">
      {/* Hero section with background blur */}
      <div className="relative bg-neutral-900 pb-12">
        {actor.profile_path && (
          <div
            className="absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w780${actor.profile_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(50px) brightness(0.5)",
            }}
          />
        )}
        <div className="px-6 md:px-20 py-12 flex flex-col md:flex-row gap-10 items-center md:items-start">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={actor.name}
            className="w-[280px] h-[420px] object-cover rounded-2xl shadow-2xl ring-1 ring-yellow-400/20"
          />
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-3">
              {actor.name}
            </h1>
            <p className="text-yellow-200 mb-4 text-sm">
              📅 {actor.birthday}{" "}
              {actor.place_of_birth && `• ${actor.place_of_birth}`}
            </p>
            {renderBiography(actor.biography)}
          </div>
        </div>
      </div>

      {/* Known For section */}
      <div className="px-6 md:px-20 py-12">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
          <span className="text-yellow-300">▍</span> Known For
        </h2>
        <div className="flex overflow-x-auto gap-6 scrollbar-thin pb-2">
          {credits.map((credit) => (
            <Link
              key={credit.imdbID}
              to={`/movie/${credit.imdbID}`}
              className="flex-shrink-0 w-36 hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-neutral-800 rounded-lg overflow-hidden shadow-md ring-1 ring-yellow-500/10">
                <img
                  src={credit.poster}
                  alt={credit.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm text-yellow-100 text-center line-clamp-2">
                    {credit.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
