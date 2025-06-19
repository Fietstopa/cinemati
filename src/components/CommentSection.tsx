import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Send } from "lucide-react";

type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: any;
};

interface Props {
  imdbID: string;
}

const CommentSection: React.FC<Props> = ({ imdbID }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "movies", imdbID, "comments"),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComments(data);
    });

    return () => unsub();
  }, [imdbID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "movies", imdbID, "comments"), {
        author: author.trim(),
        text: text.trim(),
        timestamp: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">💬 Comments</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-black/60 p-4 rounded-lg border border-yellow-500/20 mb-6 space-y-3"
      >
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-900 text-yellow-50 border border-yellow-500/20 placeholder-yellow-500 text-sm"
        />
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-900 text-yellow-50 border border-yellow-500/20 placeholder-yellow-500 text-sm resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded font-semibold transition disabled:opacity-60"
        >
          <Send className="w-4 h-4" /> Post Comment
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-yellow-300/70 text-sm">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="bg-neutral-900/60 p-4 rounded-lg border border-yellow-500/10"
            >
              <div className="flex justify-between items-center mb-1 text-sm text-yellow-300">
                <span className="font-semibold">{c.author}</span>
                <span className="text-yellow-100/50 text-xs">
                  {c.timestamp?.toDate
                    ? new Date(c.timestamp.toDate()).toLocaleString()
                    : "Just now"}
                </span>
              </div>
              <p className="text-yellow-50 text-sm whitespace-pre-wrap">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
