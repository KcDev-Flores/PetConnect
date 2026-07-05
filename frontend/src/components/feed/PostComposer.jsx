import Avatar from "../ui/Avatar";
import Icon from "../icons/Icons";

export default function PostComposer({
  activePet,
  value,
  onChange,
  onSubmit,
  onPhotoClick,
  onLocationClick,
  disabled = false,
  placeholder = "¿Qué está haciendo tu mascota hoy?",
}) {
  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <Avatar icon={activePet?.icon ?? "paw"} size="sm" color={activePet?.color} />
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value?.trim()}
          className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Publicar
        </button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100 text-sm font-semibold text-slate-500">
        <button
          type="button"
          onClick={onPhotoClick}
          className="flex items-center justify-center gap-2 py-3 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Icon name="camera" size={18} />
          Foto
        </button>
        <button
          type="button"
          onClick={onLocationClick}
          className="flex items-center justify-center gap-2 py-3 transition-colors hover:bg-sky-50 hover:text-sky-600"
        >
          <Icon name="pin" size={18} />
          Ubicacion
        </button>
      </div>
    </form>
  );
}
