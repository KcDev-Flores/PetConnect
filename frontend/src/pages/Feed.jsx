import { useEffect, useState } from "react";
import { useFeed } from "../hooks/useFeed";
import SocialFeed from "../components/feed/SocialFeed";
import PostComposer from "../components/feed/PostComposer";
import Stories from "../components/ui/Stories";
import Icon from "../components/icons/Icons";

const FOLLOWED_PETS_KEY = "petconnect:followed-pets";

function readFollowedPetIds() {
  try {
    return JSON.parse(localStorage.getItem(FOLLOWED_PETS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveFollowedPetIds(ids) {
  localStorage.setItem(FOLLOWED_PETS_KEY, JSON.stringify(ids));
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function optimizeImage(file) {
  const originalImage = await readImageAsDataUrl(file);
  const image = new Image();

  return new Promise((resolve) => {
    image.onload = () => {
      const maxSize = 1400;
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

export default function Feed() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [followedPetIds, setFollowedPetIds] = useState(() => readFollowedPetIds());
  const [postDraft, setPostDraft] = useState({
    content: "",
    image: "",
    location: "",
  });
  const {
    feedPosts,
    loading,
    ownedPets,
    publicPets,
    activePet,
    selectedPetId,
    setSelectedPetId,
    publishPost,
    togglePostLike,
    addPostComment,
  } = useFeed();
  const suggestedPets = publicPets
    .filter((pet) =>
      !ownedPets.some((ownedPet) => String(ownedPet.id) === String(pet.id)) &&
      pet.id !== activePet?.id &&
      !followedPetIds.some((followedId) => String(followedId) === String(pet.id))
    )
    .slice(0, 6)
    .map((pet) => ({
      ...pet,
      followers: pet.followers,
    }));

  useEffect(() => {
    const openComposer = () => setIsComposerOpen(true);
    window.addEventListener("petconnect:open-composer", openComposer);

    return () => window.removeEventListener("petconnect:open-composer", openComposer);
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    await publishPost({
      petId: selectedPetId,
      content: postDraft.content,
      image: postDraft.image,
      location: { name: postDraft.location },
    });
    setPostDraft({ content: "", image: "", location: "" });
    setIsComposerOpen(false);
  };

  const handlePhotoSelect = async (file) => {
    if (!file) return;
    const image = await optimizeImage(file);
    setPostDraft((current) => ({ ...current, image }));
  };

  const handleToggleFollow = (petId) => {
    setFollowedPetIds((current) => {
      const nextIds = current.includes(petId)
        ? current.filter((id) => id !== petId)
        : [...current, petId];

      saveFollowedPetIds(nextIds);
      return nextIds;
    });
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
        <header className="sticky top-[65px] z-30 -mx-2 flex items-center justify-between gap-4 rounded-3xl border border-white/70 bg-slate-50/85 px-2 py-2 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-0">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Feed</h1>
            <p className="text-sm text-slate-500">Historias y publicaciones de la comunidad.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-emerald-600"
          >
            <Icon name="plus" size={17} />
            Crear
          </button>
        </header>

        <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white px-4 pt-4 shadow-sm">
          <Stories ownedPets={ownedPets} activePet={activePet} />
        </div>

        <SocialFeed
          title=""
          subtitle=""
          posts={feedPosts}
          activePet={activePet}
          ownedPets={ownedPets}
          selectedPetId={selectedPetId}
          onPetChange={(e) => setSelectedPetId(e.target.value)}
          composerValue={postDraft.content}
          composerImage={postDraft.image}
          composerLocation={postDraft.location}
          onComposerChange={(e) => setPostDraft((current) => ({ ...current, content: e.target.value }))}
          onPhotoSelect={handlePhotoSelect}
          onPhotoRemove={() => setPostDraft((current) => ({ ...current, image: "" }))}
          onLocationChange={(e) => setPostDraft((current) => ({ ...current, location: e.target.value }))}
          onPublish={handlePublish}
          showComposer={false}
          friendSuggestions={suggestedPets}
          followedPetIds={followedPetIds}
          onToggleFollow={handleToggleFollow}
          onLike={togglePostLike}
          onAddComment={addPostComment}
        />
      </section>

      <aside className="hidden space-y-4 xl:sticky xl:top-24 xl:block">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
              <Icon name="plus" size={22} />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Crear publicacion</h2>
              <p className="text-sm text-slate-500">Comparte foto, descripcion y ubicacion.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-600"
          >
            <Icon name="camera" size={18} />
            Nueva publicacion
          </button>
        </div>

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
            {suggestedPets.slice(0, 3).map((pet) => (
              <button key={pet.id} type="button" className="flex w-full gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-slate-50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                  <Icon name={pet.icon || "paw"} size={19} />
                </span>
                <span>
                  <p className="text-sm font-bold text-slate-800">{pet.name}</p>
                  <p className="text-xs text-slate-500">{pet.breed}</p>
                </span>
              </button>
            ))}
            {!suggestedPets.length && (
              <p className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-400">
                Las sugerencias apareceran cuando el backend devuelva mas perfiles.
              </p>
            )}
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setIsComposerOpen(true)}
        className="fixed bottom-6 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/25 transition-transform hover:scale-105 hover:bg-emerald-600 md:bottom-8 xl:hidden"
        aria-label="Crear publicacion"
      >
        <Icon name="plus" size={25} />
      </button>

      {isComposerOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:py-8">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Nueva publicacion</p>
                <h2 className="text-lg font-black text-slate-900">Comparte con la comunidad</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[78vh] overflow-y-auto p-4">
              <PostComposer
                activePet={activePet}
                ownedPets={ownedPets}
                selectedPetId={selectedPetId}
                onPetChange={(e) => setSelectedPetId(e.target.value)}
                value={postDraft.content}
                imagePreview={postDraft.image}
                locationValue={postDraft.location}
                onChange={(e) => setPostDraft((current) => ({ ...current, content: e.target.value }))}
                onPhotoSelect={handlePhotoSelect}
                onPhotoRemove={() => setPostDraft((current) => ({ ...current, image: "" }))}
                onLocationChange={(e) => setPostDraft((current) => ({ ...current, location: e.target.value }))}
                onSubmit={handlePublish}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
