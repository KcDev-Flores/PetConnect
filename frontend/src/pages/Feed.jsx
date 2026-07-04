import { useState } from "react";
import { posts, pets } from "../data/mockData";
import SocialFeed from "../components/feed/SocialFeed";
import Stories from "../components/ui/Stories";
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
    <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
      <section className="min-w-0 space-y-5">
        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/70 to-sky-50 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Comunidad activa</p>
              <h1 className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-3xl">Muro Social PetConnect</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Publicaciones, avistamientos y momentos cotidianos de mascotas en la red local.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["128", "Familias"],
                ["24", "Alertas"],
                ["8", "Matches"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-white">
                  <p className="text-xl font-black text-slate-900">{value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Stories />
        </div>

        <SocialFeed
          title="Actividad reciente"
          subtitle="Contenido mock listo para que Persona 2 conecte estado y acciones."
          posts={feedPosts}
          activePet={activePet}
          composerValue={newPost}
          onComposerChange={(e) => setNewPost(e.target.value)}
          onPublish={handlePublish}
        />
      </section>

      <aside className="space-y-4 xl:sticky xl:top-24">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Icon name="shield" size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Red verificada</h2>
              <p className="text-sm text-slate-500">UI preparada para perfiles, mascotas y reportes.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["camera", "Fotos recientes", "Ayudan al matching visual"],
              ["map", "Zonas locales", "San Salvador, Sonsonate y Santa Tecla"],
              ["spark", "IA en espera", "Fal y Exa entran en la siguiente fase"],
            ].map(([icon, title, text]) => (
              <div key={title} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <Icon name={icon} size={18} className="mt-0.5 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{title}</p>
                  <p className="text-xs text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
