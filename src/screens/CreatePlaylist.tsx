import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const EMOJIS = ["🔫", "😂", "👻", "❤️", "👽", "🎭", "🐉", "🔪", "🐰", "🎵"];

const CreatePlaylist: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [coverEmoji, setCoverEmoji] = useState("🎭"); // default
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleCreate = async () => {
    if (!userId || !name.trim()) return;

    await addDoc(collection(db, "users", userId, "playlists"), {
      name: name.trim(),
      coverEmoji,
      movies: [],
      createdAt: Timestamp.now(),
    });

    setSuccess(true);
    setName("");
    setCoverEmoji("🎭");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-neutral-900 p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-xl font-bold mb-4 text-yellow-400">
          Create a Playlist
        </h1>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name"
          className="w-full p-2 rounded border border-gray-600 bg-black text-white mb-4"
        />

        <div className="mb-4">
          <p className="text-sm text-yellow-300 mb-1">Choose a cover emoji:</p>
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setCoverEmoji(emoji)}
                className={`text-2xl p-2 rounded border ${
                  coverEmoji === emoji
                    ? "bg-yellow-400 text-black font-bold"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-300"
        >
          Create Playlist
        </button>

        {success && (
          <p className="mt-4 text-green-400">Playlist created successfully!</p>
        )}

        <Link
          to="/watchlists"
          className="block mt-6 text-sm text-yellow-200 hover:underline"
        >
          ← Back to My Watchlists
        </Link>
      </div>
    </div>
  );
};

export default CreatePlaylist;
