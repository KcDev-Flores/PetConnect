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
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex gap-3">
        <Avatar icon={activePet?.icon ?? "paw"} size="sm" color={activePet?.color} />
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          disabled={disabled}
          className="flex-1 resize-none border-0 focus:ring-0 text-slate-700 placeholder:text-slate-400 outline-none disabled:opacity-50"
        />
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
        <div className="flex gap-4 text-sm text-slate-400">
          <button
            type="button"
            onClick={onPhotoClick}
            className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
          >
            <Icon name="camera" size={18} />
            Foto
          </button>
          <button
            type="button"
            onClick={onLocationClick}
            className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
          >
            <Icon name="pin" size={18} />
            Ubicación
          </button>
        </div>
        <button
          type="submit"
          disabled={disabled || !value?.trim()}
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Publicar
        </button>
      </div>
    </form>
  );
}
