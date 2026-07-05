import { useRef, useState } from "react";
import Avatar from "../ui/Avatar";
import Icon from "../icons/Icons";

function PostLocationMap({ location }) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`;
  const lat = Math.min(Math.max(location.lat ?? 52, 18), 82);
  const lng = Math.min(Math.max(location.lng ?? 50, 16), 84);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-sky-100 bg-white">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-sky-100 via-emerald-50 to-amber-100">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15, 23, 42, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute left-6 right-8 top-1/2 h-7 -translate-y-1/2 rounded-full bg-white/55 blur-sm" />
        <div className="absolute bottom-5 left-0 h-9 w-full rotate-[-7deg] bg-emerald-300/45" />
        <div className="absolute right-0 top-4 h-10 w-2/3 rotate-[12deg] bg-sky-300/35" />
        <div
          className="absolute rounded-full border-2 border-sky-500 bg-sky-300/25"
          style={{
            left: `${lng}%`,
            top: `${lat}%`,
            width: 58,
            height: 58,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute grid h-9 w-9 place-items-center rounded-full bg-white text-sky-600 shadow-lg"
          style={{
            left: `${lng}%`,
            top: `${lat}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Icon name="pin" size={17} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-700">
          <Icon name="map" size={16} className="shrink-0 text-sky-500" />
          <span className="truncate">{location.name}</span>
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-600 transition-colors hover:bg-sky-100"
        >
          Abrir Maps
        </a>
      </div>
    </div>
  );
}

export default function PostCard({ post, onLike, onAddComment }) {
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef(null);
  const mediaTone = post.icon === "cat"
    ? "from-sky-100 via-white to-indigo-100 text-sky-600"
    : "from-amber-100 via-white to-emerald-100 text-amber-600";
  const visibleComments = post.commentsList ?? [];

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    onAddComment?.(post, commentText);
    setCommentText("");
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-emerald-400 p-[2px]">
            <div className="rounded-full bg-white p-[2px]">
              {post.petPhotoUrl ? (
                <img src={post.petPhotoUrl} alt={post.petName} className="h-10 w-10 rounded-2xl object-cover" />
              ) : (
                <Avatar icon={post.icon} size="sm" color={post.color} />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black text-slate-900">{post.petName}</h3>
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Icon name="pin" size={12} />
              {post.location?.name ?? "Comunidad PetConnect"}
            </p>
          </div>
        </div>
        <button type="button" aria-label="Mas opciones" className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700">
          <Icon name="more" size={20} />
        </button>
      </header>

      <div className={`relative aspect-square bg-gradient-to-br ${mediaTone}`}>
        {post.image ? (
          <div className="h-full w-full overflow-hidden">
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="grid h-28 w-28 place-items-center rounded-[2rem] bg-white/80 shadow-xl backdrop-blur">
              <Icon name={post.icon || "paw"} size={58} />
            </div>
            <p className="mt-5 max-w-xs text-sm font-semibold text-slate-500">
              Momento compartido por la comunidad.
            </p>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
          {post.time}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onLike?.(post)}
            className={`transition-colors hover:text-rose-500 ${post.liked ? "text-rose-500" : "text-slate-800"}`}
            aria-label="Me gusta"
          >
            <Icon name="heart" size={25} />
          </button>
          <button
            type="button"
            onClick={() => commentInputRef.current?.focus()}
            className="text-slate-800 transition-colors hover:text-sky-500"
            aria-label="Comentar"
          >
            <Icon name="comment" size={25} />
          </button>
        </div>

        <p className="mt-3 text-sm font-black text-slate-900">{post.likes} Me gusta</p>
        {post.content && (
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <span className="font-black text-slate-900">{post.petName}</span>{" "}
            {post.content}
          </p>
        )}

        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-slate-400">
            {post.comments} comentarios
          </p>
          {visibleComments.slice(-3).map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="font-black text-slate-900">{comment.author}</span>{" "}
              {comment.text}
            </div>
          ))}
        </div>

        {post.location && <PostLocationMap location={post.location} />}

        <form onSubmit={handleCommentSubmit} className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
          <Avatar icon="user" size="sm" />
          <input
            ref={commentInputRef}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            className="min-w-0 flex-1 rounded-full bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="Agrega un comentario..."
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="text-xs font-black text-emerald-600 transition-colors hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Publicar
          </button>
        </form>
      </div>
    </article>
  );
}
