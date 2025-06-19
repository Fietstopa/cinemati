import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { ArrowLeft, Trash } from "lucide-react";

interface Movie {
  imdbID: string;
  title: string;
  poster: string;
  year: string;
}

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const user = auth.currentUser;
      if (!user || !id) return;

      const ref = doc(db, "users", user.uid, "playlists", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setName(data.name);
        setMovies(data.movies || []);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handleDelete = async (imdbID: string) => {
    const user = auth.currentUser;
    if (!user || !id) return;

    try {
      const ref = doc(db, "users", user.uid, "playlists", id);
      const newMovies = movies.filter((movie) => movie.imdbID !== imdbID);
      await updateDoc(ref, { movies: newMovies });
      setMovies(newMovies); // update local state
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-50 p-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{name || "Playlist"}</h1>
        <Link
          to="/watchlists"
          className="text-yellow-300 text-sm hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Watchlists
        </Link>
      </div>

      {movies.length === 0 ? (
        <p className="text-yellow-300">This playlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="relative bg-neutral-800 hover:bg-neutral-700 p-2 rounded-lg group"
            >
              <Link to={`/movie/${movie.imdbID}`}>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto rounded-md mb-2 object-cover"
                />
                <h3 className="text-sm font-semibold truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-yellow-400">{movie.year}</p>
              </Link>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(movie.imdbID)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/90 text-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
