import { useEffect, useMemo, useState } from "react";
import Icon from "../icons/Icons";

const STORIES_KEY = "petconnect_stories";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const demoStories = [
  { id: "demo-max", name: "Max", place: "Izalco", caption: "Paseo de la manana con mucho sol.", icon: "dog", color: "#F59E0B", tone: "from-amber-400 via-orange-300 to-emerald-400" },
  { id: "demo-cleo", name: "Cleo", place: "Colon", caption: "Nueva zona favorita para explorar.", icon: "cat", color: "#38BDF8", tone: "from-sky-400 via-cyan-300 to-emerald-300" },
  { id: "demo-rocky", name: "Rocky", place: "Sonsonate", caption: "Rocky encontro amigos en el parque.", icon: "dog", color: "#EC4899", tone: "from-rose-400 via-pink-300 to-amber-300" },
  { id: "demo-bella", name: "Bella", place: "Juayua", caption: "Dia tranquilo, mucha sombra y agua.", icon: "paw", color: "#10B981", tone: "from-emerald-400 via-lime-300 to-sky-300" },
  { id: "demo-michi", name: "Michi", place: "Cuscatlan", caption: "Michi supervisando todo desde arriba.", icon: "cat", color: "#8B5CF6", tone: "from-violet-400 via-indigo-300 to-sky-300" },
];

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function optimizeStoryImage(file) {
  const originalImage = await readImageAsDataUrl(file);
  const image = new Image();

  return new Promise((resolve) => {
    image.onload = () => {
      const maxSize = 1280;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    image.onerror = () => resolve(originalImage);
    image.src = originalImage;
  });
}

function getStoredStories() {
  try {
    const now = Date.now();
    const stories = JSON.parse(localStorage.getItem(STORIES_KEY)) ?? [];
    const activeStories = stories.filter((story) => story.expiresAt > now);
    localStorage.setItem(STORIES_KEY, JSON.stringify(activeStories));
    return activeStories;
  } catch {
    return [];
  }
}

function saveStoredStories(stories) {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch {
    const lightweightStories = stories.map((story, index) => index === 0 ? story : { ...story, image: null });
    localStorage.setItem(STORIES_KEY, JSON.stringify(lightweightStories));
  }
}

function getTimeLeft(expiresAt) {
  const remainingHours = Math.max(1, Math.ceil((expiresAt - Date.now()) / (60 * 60 * 1000)));
  return `${remainingHours}h`;
}

function StoryAvatar({ story, onOpen }) {
  return (
    <button type="button" onClick={() => onOpen(story)} className="group flex w-[78px] shrink-0 flex-col items-center gap-2">
      <div className="relative grid h-[70px] w-[70px] place-items-center rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-emerald-400 p-[3px] transition-transform group-active:scale-95">
        <div className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-white p-1">
          {story.image ? (
            <img src={story.image} alt={story.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <div
              className="grid h-full w-full place-items-center rounded-full text-emerald-700 shadow-inner"
              style={{ backgroundColor: story.color ? `${story.color}22` : "#F8FAFC" }}
            >
              <Icon name={story.icon} size={26} />
            </div>
          )}
        </div>
        {story.expiresAt && (
          <span className="absolute -bottom-1 rounded-full border border-white bg-slate-900 px-2 py-0.5 text-[9px] font-black text-white">
            {getTimeLeft(story.expiresAt)}
          </span>
        )}
      </div>
      <span className="max-w-[78px] truncate text-center text-xs font-semibold leading-tight text-slate-700">
        {story.name}
        {story.place && <span className="block text-[10px] font-medium text-slate-400">{story.place}</span>}
      </span>
    </button>
  );
}

function StoryViewer({ story, onClose, onDelete }) {
  if (!story) return null;
  const mapsUrl = story.place ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(story.place)}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4 py-6">
      <div className="relative h-full max-h-[800px] w-full max-w-[430px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
        <div className="absolute left-4 right-4 top-4 z-10">
          <div className="h-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-full rounded-full bg-white" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white/20 text-white">
                {story.image ? <img src={story.image} alt="" className="h-full w-full object-cover" /> : <Icon name={story.icon} size={20} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">{story.name}</p>
                <p className="text-xs font-semibold text-white/70">
                  {story.expiresAt ? `Disponible por ${getTimeLeft(story.expiresAt)}` : "Historia destacada"}
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur transition-colors hover:bg-white/25">
              Cerrar
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />

        {story.image ? (
          <img src={story.image} alt={story.name} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full flex-col items-center justify-center bg-gradient-to-br ${story.tone ?? "from-emerald-400 via-sky-300 to-amber-300"} p-8 text-center text-white`}>
            <div className="grid h-28 w-28 place-items-center rounded-[2rem] bg-white/20 backdrop-blur">
              <Icon name={story.icon} size={58} />
            </div>
            <h3 className="mt-5 text-3xl font-black">{story.name}</h3>
            <p className="mt-2 text-sm font-semibold text-white/80">{story.place}</p>
          </div>
        )}

        <div className="absolute bottom-5 left-4 right-4 z-20 space-y-3">
          {story.caption && (
            <div className="rounded-3xl bg-white/12 p-4 text-white shadow-xl backdrop-blur">
              <p className="text-sm font-semibold leading-relaxed">{story.caption}</p>
            </div>
          )}

          {story.place && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-fit max-w-full items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-900 shadow-lg transition-colors hover:bg-white"
            >
              <Icon name="pin" size={16} className="shrink-0 text-sky-600" />
              <span className="truncate">{story.place}</span>
            </a>
          )}
        </div>

        {story.isOwner && (
          <button
            type="button"
            onClick={() => onDelete(story.id)}
            className="absolute right-4 top-20 z-20 rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            Eliminar historia
          </button>
        )}
      </div>
    </div>
  );
}

function StoryEditor({ draft, onChange, onPublish, onCancel }) {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4 py-6">
      <form onSubmit={onPublish} className="relative h-full max-h-[800px] w-full max-w-[430px] overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
        <img src={draft.image} alt="Vista previa de historia" className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <button type="button" onClick={onCancel} className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur transition-colors hover:bg-white/25">
            Cancelar
          </button>
          <p className="rounded-full bg-white/15 px-4 py-2 text-xs font-black text-white backdrop-blur">
            Nueva historia
          </p>
        </div>

        <div className="absolute bottom-5 left-4 right-4 space-y-3">
          <label className="block rounded-3xl bg-white/95 p-4 shadow-xl backdrop-blur">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Descripcion</span>
            <textarea
              value={draft.caption}
              onChange={(event) => onChange({ ...draft, caption: event.target.value })}
              placeholder="Escribe algo sobre esta historia..."
              rows={3}
              className="mt-2 w-full resize-none bg-transparent text-sm font-semibold leading-relaxed text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex items-center gap-3 rounded-3xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
            <Icon name="pin" size={18} className="shrink-0 text-sky-600" />
            <input
              value={draft.place}
              onChange={(event) => onChange({ ...draft, place: event.target.value })}
              placeholder="Agregar ubicacion"
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-800 outline-none placeholder:font-semibold placeholder:text-slate-400"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl transition-transform hover:scale-[1.01]"
          >
            Compartir historia
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Stories() {
  const [userStories, setUserStories] = useState(() => getStoredStories());
  const [activeStory, setActiveStory] = useState(null);
  const [storyDraft, setStoryDraft] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setUserStories(getStoredStories());
    }, 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const stories = useMemo(() => [...userStories, ...demoStories], [userStories]);

  const handleStoryUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    const image = await optimizeStoryImage(file);
    setStoryDraft({ image, caption: "", place: "" });
    setIsUploading(false);
  };

  const handlePublishStory = (event) => {
    event.preventDefault();
    if (!storyDraft?.image) return;

    const now = Date.now();
    const story = {
      id: `story-${now}`,
      name: "Tu historia",
      icon: "paw",
      image: storyDraft.image,
      caption: storyDraft.caption.trim(),
      place: storyDraft.place.trim(),
      isOwner: true,
      createdAt: now,
      expiresAt: now + DAY_IN_MS,
    };

    const nextStories = [story, ...getStoredStories()].slice(0, 8);
    saveStoredStories(nextStories);
    setUserStories(nextStories);
    setActiveStory(story);
    setStoryDraft(null);
  };

  const handleDeleteStory = (storyId) => {
    const nextStories = userStories.filter((story) => story.id !== storyId);
    saveStoredStories(nextStories);
    setUserStories(nextStories);
    setActiveStory(null);
  };

  return (
    <>
      <div className="flex gap-5 overflow-x-auto px-1 pb-3 pt-1 select-none">
        <label className="group flex w-[78px] shrink-0 cursor-pointer flex-col items-center gap-2">
          <div className="relative grid h-[70px] w-[70px] place-items-center rounded-full bg-slate-200 p-[3px] transition-transform group-active:scale-95">
            <div className="grid h-full w-full place-items-center rounded-full bg-white p-1">
              <div className="grid h-full w-full place-items-center rounded-full bg-emerald-50 text-emerald-700 shadow-inner">
                <Icon name={isUploading ? "upload" : "plus"} size={24} />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white">
              <Icon name="camera" size={13} />
            </span>
          </div>
          <span className="max-w-[78px] truncate text-center text-xs font-semibold leading-tight text-slate-700">
            {isUploading ? "Subiendo" : "Nueva historia"}
            <span className="block text-[10px] font-medium text-slate-400">24 horas</span>
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            className="sr-only"
            onChange={(event) => {
              handleStoryUpload(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
        </label>

        {stories.map((story) => (
          <StoryAvatar key={story.id} story={story} onOpen={setActiveStory} />
        ))}
      </div>

      <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} onDelete={handleDeleteStory} />
      <StoryEditor
        draft={storyDraft}
        onChange={setStoryDraft}
        onPublish={handlePublishStory}
        onCancel={() => setStoryDraft(null)}
      />
    </>
  );
}
