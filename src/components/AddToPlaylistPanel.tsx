import React, { useEffect, useState } from "react";
import { BookmarkPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

interface Playlist {
  id: string;
  name: string;
  coverEmoji?: string;
  movies?: any[];
}

interface AddToPlaylistPanelProps {
  movie: {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
  };
}

const AddToPlaylistPanel: React.FC<AddToPlaylistPanelProps> = ({ movie }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    setUserId(user.uid);

    const fetchPlaylists = async () => {
      const snap = await getDocs(
        collection(db, "users", user.uid, "playlists")
      );
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Playlist[];
      setPlaylists(data);
    };

    fetchPlaylists();
  }, []);

  const handleAdd = async () => {
    if (!userId || !selectedPlaylist || !movie) return;
    setAdding(true);

    try {
      const playlistRef = doc(
        db,
        "users",
        userId,
        "playlists",
        selectedPlaylist
      );
      const snapshot = await getDocs(
        collection(db, "users", userId, "playlists")
      );
      const target = snapshot.docs.find((doc) => doc.id === selectedPlaylist);

      if (!target) return;

      const data = target.data();
      const movies = data.movies || [];

      const exists = movies.find((m: any) => m.imdbID === movie.imdbID);
      if (!exists) {
        movies.push({
          imdbID: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: movie.Year,
        });

        await updateDoc(playlistRef, { movies });

        await setDoc(
          doc(db, "movies", movie.imdbID),
          { saveCount: increment(1) },
          { merge: true }
        );

        setAddedMsg("Added!");
      } else {
        setAddedMsg("Already in playlist.");
      }
    } catch (err) {
      console.error(err);
      setAddedMsg("Error.");
    } finally {
      setAdding(false);
      setTimeout(() => setAddedMsg(""), 2500);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-yellow-400 hover:text-yellow-300">
          <BookmarkPlus className="w-10 h-10" />
        </button>
      </DialogTrigger>

      <DialogContent className="bg-black border border-yellow-500/20 rounded-xl shadow-yellow-500/10 p-6">
        <DialogHeader className="mb-4 flex justify-between items-start">
          <DialogTitle className="text-yellow-200 text-lg">
            Add to Watchlist
          </DialogTitle>
          <DialogClose asChild>
            <button className="text-yellow-400 hover:text-yellow-300">
              <X className="w-5 h-5" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-2">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => setSelectedPlaylist(pl.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all
                ${
                  selectedPlaylist === pl.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-neutral-700 hover:border-yellow-400"
                }`}
            >
              <div className="text-xl">{pl.coverEmoji || "🎬"}</div>
              <div className="text-left">
                <p className="text-sm text-yellow-100">{pl.name}</p>
                <p className="text-xs text-yellow-300">
                  {pl.movies?.length ?? 0} movies
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={handleAdd}
            disabled={!selectedPlaylist || adding}
            className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold"
          >
            {adding ? "Adding…" : "Add"}
          </Button>
          {addedMsg && (
            <span className="text-sm text-yellow-300">{addedMsg}</span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistPanel;
