import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

interface Playlist {
  id: string;
  name: string;
  movies: any[];
  coverEmoji?: string;
}

const MyWatchlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = collection(db, "users", user.uid, "playlists");
      const snapshot = await getDocs(ref);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data() as Omit<Playlist, "id">;
        return { ...d, id: doc.id };
      });

      setPlaylists(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 md:p-30 bg-black min-h-screen text-yellow-50">
      <h1 className="text-5xl font-bold mb-6">My Watchlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {/* Add New Playlist */}
        <Link
          to="/create-playlist"
          className="aspect-square bg-neutral-700 hover:bg-neutral-600 rounded flex items-center justify-center text-4xl text-white"
        >
          <Plus className="w-12 h-12" />
        </Link>

        {/* Existing playlists */}
        {playlists.map((pl) => (
          <Link
            key={pl.id}
            to={`/playlist/${pl.id}`}
            className="aspect-square bg-neutral-800 hover:bg-neutral-700 rounded overflow-hidden relative flex items-center justify-center text-white text-6xl"
          >
            <span>{pl.coverEmoji || "🎬"}</span>

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-left">
              <p className="text-base font-semibold truncate">{pl.name}</p>
              <p className="text-sm text-yellow-300">
                {pl.movies.length} movies
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyWatchlists;
