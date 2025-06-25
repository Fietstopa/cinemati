import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Actor = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for: { title?: string; name?: string }[];
};

const TMDB_API_KEY = "024c86461eb1256eaa22934b9a84ec59";

const PopularActors: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setActors(data.results.slice(0, 20)); // např. 20 top herců
      } catch (err) {
        console.error("Failed to fetch popular actors:", err);
      }
    };

    fetchActors();
  }, []);

  return (
    <div className="px-4  md:px-30 py-10 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4 ">
        {" "}
        <span className="text-yellow-400">▍</span>
        Popular Actors
      </h2>
      <div className="flex gap-6 overflow-x-auto scrollbar-thin pb-3">
        {actors.map((actor) => (
          <Link
            key={actor.id}
            to={`/person/${actor.id}`}
            className="flex-shrink-0 w-36 text-center hover:scale-105 transition"
          >
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={actor.name}
              className="w-full h-52 object-cover rounded-lg shadow"
            />
            <p className="mt-2 text-sm font-semibold">{actor.name}</p>
            <p className="text-xs text-gray-400 line-clamp-1">
              {actor.known_for?.[0]?.title || actor.known_for?.[0]?.name || ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularActors;
