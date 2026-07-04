import { PhotoUploadZone, FormField, inputClass, textareaClass } from "../ui/FormPrimitives";
import Icon from "../icons/Icons";

const speciesOptions = ["Perro", "Gato", "Otro"];

export default function AlertForm({
  values,
  onChange,
  onPhotoSelect,
  onPhotoRemove,
  onSubmit,
  breedOptions = [],
  isSubmitting = false,
}) {
  const set = (field) => (e) => onChange?.({ ...values, [field]: e.target.value });

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <Icon name="alert" size={22} className="text-red-500" />
        <div>
          <h2 className="font-bold text-slate-800">Reportar mascota perdida</h2>
          <p className="text-xs text-slate-500">UI lista para integracion con IA y n8n</p>
        </div>
      </div>

      <PhotoUploadZone
        label="Foto de la mascota *"
        hint="Sube la foto mas reciente para mejorar el matching"
        previewUrl={values.photoPreview}
        onSelect={onPhotoSelect}
        onRemove={onPhotoRemove}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Nombre" required>
          <input
            value={values.petName}
            onChange={set("petName")}
            placeholder="Ej: Toby"
            className={inputClass}
            required
          />
        </FormField>
        <FormField label="Especie" required>
          <select value={values.species} onChange={set("species")} className={inputClass} required>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Raza" required>
        <input
          list="breed-list"
          value={values.breed}
          onChange={set("breed")}
          placeholder="Ej: Beagle, Siamés..."
          className={inputClass}
          required
        />
        {breedOptions.length > 0 && (
          <datalist id="breed-list">
            {breedOptions.map((b) => (
              <option key={b.id ?? b.name} value={b.name} />
            ))}
          </datalist>
        )}
      </FormField>

      <FormField label="Descripción" required>
        <textarea
          value={values.description}
          onChange={set("description")}
          placeholder="Color, collar, señas particulares, comportamiento..."
          rows={3}
          className={textareaClass}
          required
        />
      </FormField>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Última ubicación vista" required>
          <input
            value={values.lastSeen}
            onChange={set("lastSeen")}
            placeholder="Ej: Colonia Escalón, San Salvador"
            className={inputClass}
            required
          />
        </FormField>
        <FormField label="Fecha" required>
          <input
            type="date"
            value={values.lastSeenDate}
            onChange={set("lastSeenDate")}
            className={inputClass}
            required
          />
        </FormField>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Teléfono de contacto" required>
          <input
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+503 0000-0000"
            className={inputClass}
            required
          />
        </FormField>
        <FormField label="Recompensa (opcional)">
          <input
            value={values.reward}
            onChange={set("reward")}
            placeholder="Ej: $50"
            className={inputClass}
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
      >
        <Icon name="alert" size={20} />
        {isSubmitting ? "Enviando alerta..." : "Enviar alerta de emergencia"}
      </button>
    </form>
  );
}
