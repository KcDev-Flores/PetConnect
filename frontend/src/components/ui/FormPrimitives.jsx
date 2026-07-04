import Icon from "../icons/Icons";

export function PhotoUploadZone({
  label = "Foto de la mascota",
  hint = "Arrastra una imagen o haz clic para seleccionar",
  previewUrl,
  onSelect,
  onRemove,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 aspect-video max-h-56">
          <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold rounded-lg hover:bg-white transition-colors"
          >
            Cambiar foto
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors cursor-pointer aspect-video max-h-56 p-6">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
            <Icon name="upload" size={28} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">{hint}</p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, max. 10 MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => onSelect?.(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}

export function FormField({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none text-sm";

export const textareaClass =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none text-sm resize-none";
