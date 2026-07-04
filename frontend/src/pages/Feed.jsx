import { useState } from "react";
import { posts, pets } from "../data/mockData";
import PostCard from "../components/ui/PostCard";
import Avatar from "../components/ui/Avatar";
import Icon from "../components/icons/Icons";

export default function Feed() {
  const [newPost, setNewPost] = useState("");
  const [feedPosts, setFeedPosts] = useState(posts);
  const activePet = pets[0];

  const handlePublish = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setFeedPosts([
      {
        id: Date.now(),
        petName: activePet.name,
        icon: activePet.icon,
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
          <Avatar icon={activePet.icon} size="sm" color={activePet.color} />
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué está haciendo tu mascota hoy?"
            rows={3}
            className="flex-1 resize-none border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
          <div className="flex gap-4 text-sm text-slate-400">
            <button type="button" className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
              <Icon name="camera" size={18} />
              Foto
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
              <Icon name="pin" size={18} />
              Ubicación
            </button>
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
