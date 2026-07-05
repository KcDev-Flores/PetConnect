import { useState } from "react";
import { useLostPets } from "../hooks/useLostPets";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import SightingMap from "../components/ui/SightingMap";
import Icon from "../components/icons/Icons";
import AlertForm from "../components/emergency/AlertForm";

const emptyAlert = {
  petName: "",
  species: "Perro",
  breed: "",
  description: "",
  lastSeen: "",
  lastSeenDate: "",
  phone: "",
  reward: "",
  photoPreview: "",
};

export default function Emergency() {
  const { reports, loading, submitSighting, submitReport, estimateLocation } = useLostPets();
  const [selectedReport, setSelectedReport] = useState(null);
  const [newSighting, setNewSighting] = useState({ comment: "", location: "" });
  const [showForm, setShowForm] = useState(false);
  const [alertDraft, setAlertDraft] = useState(emptyAlert);

  // If reports loaded and no selectedReport, select the first one
  const activeReport = selectedReport || (reports.length > 0 ? reports[0] : null);
  const estimated = activeReport ? estimateLocation(activeReport.sightings) : null;

  const handlePhotoSelect = (file) => {
    if (!file) return;
    setAlertDraft((current) => ({
      ...current,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  const handleAlertSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      petName: alertDraft.petName || "Mascota sin nombre",
      breed: alertDraft.breed || "Raza por confirmar",
      species: alertDraft.species,
      description: alertDraft.description || "Descripcion pendiente.",
      lastSeen: alertDraft.lastSeen || "Ubicacion pendiente",
      lastSeenDate: alertDraft.lastSeenDate || "Hoy",
      reward: alertDraft.reward || null,
      phone: alertDraft.phone,
    };

    await submitReport(reportData);
    setAlertDraft(emptyAlert);
    setShowForm(false);
  };

  const handleAddSighting = async (e) => {
    e.preventDefault();
    if (!newSighting.comment.trim() || !activeReport) return;

    await submitSighting(activeReport.id, newSighting);
    setNewSighting({ comment: "", location: "" });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Cargando alertas...</p>
      </div>
    );
  }

  if (!activeReport) return null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Centro de Emergencias</h1>
          <p className="text-slate-500 mt-1">Reporta mascotas perdidas y colabora con avistamientos</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm self-start"
        >
          <Icon name="alert" size={18} />
          Reportar mascota perdida
        </button>
      </header>

      {showForm && (
        <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
          <AlertForm
            values={alertDraft}
            onChange={setAlertDraft}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={() => setAlertDraft((current) => ({ ...current, photoPreview: "" }))}
            onSubmit={handleAlertSubmit}
            breedOptions={[]}
          />
          <aside className="rounded-2xl border border-red-100 bg-red-50 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-red-500">
                <Icon name="clock" size={22} />
              </div>
              <div>
                <h2 className="font-bold text-red-900">Entrega visual P1</h2>
                <p className="text-sm text-red-700">Formulario listo para que Persona 2 conecte Zustand y n8n.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 text-sm text-red-800">
              <p className="flex gap-2">
                <Icon name="camera" size={18} className="mt-0.5 shrink-0" />
                Foto principal preparada para analisis visual.
              </p>
              <p className="flex gap-2">
                <Icon name="map" size={18} className="mt-0.5 shrink-0" />
                Campos listos para ubicacion, fecha y contacto.
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Alertas activas</h2>
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedReport(report)}
              className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
                activeReport.id === report.id
                  ? "border-red-300 shadow-md ring-2 ring-red-100"
                  : "border-slate-100 hover:border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar icon={report.icon} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{report.petName}</h3>
                    <Badge variant="danger">Perdido</Badge>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{report.breed} · {report.lastSeen}</p>
                  <p className="text-xs text-slate-400 mt-1">{report.sightings.length} avistamientos</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar icon={activeReport.icon || "dog"} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">{activeReport.petName}</h2>
                <p className="text-emerald-600 font-medium">{activeReport.breed} · {activeReport.species}</p>
                <p className="text-slate-600 mt-2">{activeReport.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="warning">Última vez: {activeReport.lastSeenDate}</Badge>
                  <Badge>{activeReport.lastSeen}</Badge>
                  {activeReport.reward && <Badge variant="success">Recompensa: {activeReport.reward}</Badge>}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-slate-800 mb-2">Mapa de avistamientos</h3>
              <p className="text-sm text-slate-500 mb-3">
                Zona probable calculada según {activeReport.sightings.length} reporte(s)
              </p>
              <SightingMap sightings={activeReport.sightings} estimated={estimated} />
            </div>

            {estimated && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <Icon name="pin" size={18} />
                  Triangulación estimada
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Según los avistamientos, {activeReport.petName} podría estar cerca de{" "}
                  <strong>{activeReport.lastSeen}</strong>. Radio de búsqueda sugerido: ~{Math.round(estimated.radius * 50)}m
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Avistamientos ({activeReport.sightings.length})</h3>
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                <Icon name="plus" size={16} />
                Reportar avistamiento
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleAddSighting} className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3">
                <input
                  value={newSighting.location}
                  onChange={(e) => setNewSighting({ ...newSighting, location: e.target.value })}
                  placeholder="¿Dónde lo viste? (ej: cerca del parque)"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none text-sm"
                />
                <textarea
                  value={newSighting.comment}
                  onChange={(e) => setNewSighting({ ...newSighting, comment: e.target.value })}
                  placeholder="Describe lo que viste..."
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none text-sm resize-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Enviar avistamiento
                </button>
              </form>
            )}

            <div className="space-y-3">
              {activeReport.sightings.map((s) => (
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

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href={`tel:${activeReport.phone}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                <Icon name="phone" size={18} />
                Contactar dueño
              </a>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                <Icon name="share" size={18} />
                Compartir alerta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
