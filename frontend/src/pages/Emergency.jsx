import { useState } from "react";
import { lostReports, estimateLocation } from "../data/mockData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import SightingMap from "../components/ui/SightingMap";
import Icon from "../components/icons/Icons";

export default function Emergency() {
  const [reports, setReports] = useState(lostReports);
  const [selectedReport, setSelectedReport] = useState(lostReports[0]);
  const [newSighting, setNewSighting] = useState({ comment: "", location: "" });
  const [showForm, setShowForm] = useState(false);

  const estimated = estimateLocation(selectedReport.sightings);

  const handleAddSighting = (e) => {
    e.preventDefault();
    if (!newSighting.comment.trim()) return;

    const sighting = {
      id: Date.now(),
      lat: 40 + Math.random() * 20,
      lng: 40 + Math.random() * 20,
      comment: newSighting.comment,
      author: "Tú",
      time: "Ahora",
      confidence: 0.8,
    };

    const updated = reports.map((r) =>
      r.id === selectedReport.id
        ? { ...r, sightings: [...r.sightings, sighting] }
        : r
    );

    setReports(updated);
    const updatedReport = updated.find((r) => r.id === selectedReport.id);
    setSelectedReport(updatedReport);
    setNewSighting({ comment: "", location: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Centro de Emergencias</h1>
          <p className="text-slate-500 mt-1">Reporta mascotas perdidas y colabora con avistamientos</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm self-start"
        >
          <Icon name="alert" size={18} />
          Reportar mascota perdida
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Alertas activas</h2>
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedReport(report)}
              className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
                selectedReport.id === report.id
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
              <Avatar icon={selectedReport.icon} size="lg" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedReport.petName}</h2>
                <p className="text-emerald-600 font-medium">{selectedReport.breed} · {selectedReport.species}</p>
                <p className="text-slate-600 mt-2">{selectedReport.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="warning">Última vez: {selectedReport.lastSeenDate}</Badge>
                  <Badge>{selectedReport.lastSeen}</Badge>
                  {selectedReport.reward && <Badge variant="success">Recompensa: {selectedReport.reward}</Badge>}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold text-slate-800 mb-2">Mapa de avistamientos</h3>
              <p className="text-sm text-slate-500 mb-3">
                Zona probable calculada según {selectedReport.sightings.length} reporte(s)
              </p>
              <SightingMap sightings={selectedReport.sightings} estimated={estimated} />
            </div>

            {estimated && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                  <Icon name="pin" size={18} />
                  Triangulación estimada
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Según los avistamientos, {selectedReport.petName} podría estar cerca de{" "}
                  <strong>{selectedReport.lastSeen}</strong>. Radio de búsqueda sugerido: ~{Math.round(estimated.radius * 50)}m
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Avistamientos ({selectedReport.sightings.length})</h3>
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
              {selectedReport.sightings.map((s) => (
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
                href={`tel:${selectedReport.phone}`}
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
