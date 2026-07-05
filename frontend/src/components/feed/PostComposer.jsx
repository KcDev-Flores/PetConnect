import { useRef } from "react";
import Avatar from "../ui/Avatar";
import Icon from "../icons/Icons";

export default function PostComposer({
  activePet,
  ownedPets = [],
  selectedPetId,
  onPetChange,
  value,
  imagePreview,
  locationValue = "",
  onChange,
  onSubmit,
  onPhotoSelect,
  onPhotoRemove,
  onLocationChange,
  onPhotoClick,
  onLocationClick,
  disabled = false,
  placeholder = "Escribe una descripcion...",
}) {
  const locationInputRef = useRef(null);
  const selectedProfileId = selectedPetId ?? activePet?.id ?? "";
  const canPublish = Boolean((value?.trim() || imagePreview) && selectedProfileId);
  const focusLocationInput = () => {
    onLocationClick?.();
    locationInputRef.current?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        {activePet?.photoUrl ? (
          <img src={activePet.photoUrl} alt={activePet.name} className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-md" />
        ) : (
          <Avatar icon={activePet?.icon ?? "paw"} size="sm" color={activePet?.color} />
        )}
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !canPublish}
          className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Publicar
        </button>
      </div>

      <div className="space-y-3 p-4">
        {ownedPets.length > 0 ? (
          <label className="flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-3 text-sm text-slate-700 sm:flex-row sm:items-center">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
              <Icon name="paw" size={16} />
              Publicar como
            </span>
            <select
              value={selectedProfileId}
              onChange={onPetChange}
              disabled={disabled}
              className="min-w-0 flex-1 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm font-black text-slate-800 outline-none transition-colors focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
              required
            >
              <option value="">Seleccionar perfil</option>
              {ownedPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} · {pet.breed}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-700">
            Primero agrega una mascota a tu perfil para poder publicar.
          </div>
        )}

        {imagePreview && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
            <img src={imagePreview} alt="Vista previa de la publicacion" className="aspect-square w-full object-cover" />
            <button
              type="button"
              onClick={onPhotoRemove}
              className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              Quitar foto
            </button>
          </div>
        )}

        <label className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 transition-colors focus-within:border-sky-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100">
          <Icon name="pin" size={18} className="shrink-0 text-sky-500" />
          <input
            ref={locationInputRef}
            value={locationValue}
            onChange={onLocationChange}
            onClick={focusLocationInput}
            placeholder="Agregar ubicacion, por ejemplo: San Salvador"
            disabled={disabled}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400 disabled:opacity-50"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 text-sm font-semibold text-slate-500">
        <label className="flex cursor-pointer items-center justify-center gap-2 py-3 transition-colors hover:bg-emerald-50 hover:text-emerald-600">
          <Icon name="camera" size={18} />
          Foto
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onClick={onPhotoClick}
            onChange={(event) => {
              onPhotoSelect?.(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          onClick={focusLocationInput}
          className="flex items-center justify-center gap-2 py-3 transition-colors hover:bg-sky-50 hover:text-sky-600"
        >
          <Icon name="pin" size={18} />
          Ubicacion
        </button>
      </div>
    </form>
  );
}
