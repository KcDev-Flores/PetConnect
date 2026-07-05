import { FormField, inputClass, textareaClass } from "../ui/FormPrimitives";
import Icon from "../icons/Icons";

export default function SightingForm({ values, onChange, onSubmit, onCancel }) {
  const set = (field) => (e) => onChange?.({ ...values, [field]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="bg-slate-50 rounded-xl p-4 space-y-3">
      <FormField label="Ubicación del avistamiento">
        <input
          value={values.location}
          onChange={set("location")}
          placeholder="¿Dónde lo viste? (ej: cerca del parque)"
          className={inputClass}
        />
      </FormField>
      <FormField label="Descripción">
        <textarea
          value={values.comment}
          onChange={set("comment")}
          placeholder="Describe lo que viste..."
          rows={2}
          className={textareaClass}
        />
      </FormField>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Enviar avistamiento
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-500 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export function SightingList({ sightings = [] }) {
  return (
    <div className="space-y-3">
      {sightings.map((s) => (
        <div key={s.id} className="flex gap-3 p-4 bg-slate-50 rounded-xl">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0 text-red-500">
            <Icon name="pin" size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">{s.author}</span>
              <span className="text-xs text-slate-400">{s.time}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1">{s.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TriangulationBanner({ petName, lastSeen, radiusMeters }) {
  if (!petName) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
      <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
        <Icon name="pin" size={18} />
        Triangulación estimada
      </p>
      <p className="text-sm text-amber-700 mt-1">
        Según los avistamientos, {petName} podría estar cerca de{" "}
        <strong>{lastSeen}</strong>
        {radiusMeters != null && (
          <>. Radio de búsqueda sugerido: ~{radiusMeters}m</>
        )}
      </p>
    </div>
  );
}
