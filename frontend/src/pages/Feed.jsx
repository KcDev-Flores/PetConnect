import { useState } from "react";
import { useFeed } from "../hooks/useFeed";
import SocialFeed from "../components/feed/SocialFeed";
import Stories from "../components/ui/Stories";
import Icon from "../components/icons/Icons";

export default function Feed() {
  const [newPost, setNewPost] = useState("");
  const { feedPosts, loading, activePet, publishPost } = useFeed();

  const handlePublish = async (e) => {
    e.preventDefault();
    await publishPost(newPost);
    setNewPost("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Cargando feed...</p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,640px)_320px] xl:justify-center">
      <section className="min-w-0 space-y-5">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Feed</h1>
            <p className="text-sm text-slate-500">Historias y publicaciones de la comunidad.</p>
          </div>
          <div className="hidden rounded-full border border-slate-100 bg-white px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm sm:block">
            PetConnect Social
          </div>
        </header>

        <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white px-4 pt-4 shadow-sm">
          <Stories />
        </div>

        <SocialFeed
          title=""
          subtitle=""
          posts={feedPosts}
          activePet={activePet}
          composerValue={newPost}
          onComposerChange={(e) => setNewPost(e.target.value)}
          onPublish={handlePublish}
        />
      </section>

      <aside className="hidden space-y-4 xl:sticky xl:top-24 xl:block">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon name="shield" size={22} />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Sugerencias</h2>
              <p className="text-sm text-slate-500">Mascotas y zonas activas.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["dog", "Max", "Golden Retriever activo"],
              ["cat", "Luna", "Historia nueva"],
              ["map", "San Salvador", "Zona con mas reportes"],
            ].map(([icon, title, text]) => (
              <button key={title} type="button" className="flex w-full gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-slate-50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Icon name={icon} size={19} />
                </span>
                <span>
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{text}</p>
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
