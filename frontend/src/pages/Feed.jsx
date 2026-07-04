import { useState } from "react";
import { posts } from "../data/mockData";
import PostCard from "../components/ui/PostCard";

export default function Feed() {
  const [newPost, setNewPost] = useState("");
  const [feedPosts, setFeedPosts] = useState(posts);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setFeedPosts([
      {
        id: Date.now(),
        petName: "Max",
        avatar: "🐕",
        content: newPost,
        likes: 0,
        comments: 0,
        time: "Ahora",
      },
      ...feedPosts,
    ]);
    setNewPost("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Feed Social</h1>
        <p className="text-slate-500 mt-1">Publicaciones de la comunidad PetConnect</p>
      </header>

      <form onSubmit={handlePublish} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex gap-3">
          <span className="text-3xl">🐕</span>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué está haciendo tu mascota hoy?"
            rows={3}
            className="flex-1 resize-none border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
          <div className="flex gap-2 text-sm text-slate-400">
            <button type="button" className="hover:text-emerald-500 transition-colors">📷 Foto</button>
            <button type="button" className="hover:text-emerald-500 transition-colors">📍 Ubicación</button>
          </div>
          <button
            type="submit"
            disabled={!newPost.trim()}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Publicar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {feedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
