import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import SightingMap from "../ui/SightingMap";
import Icon from "../icons/Icons";
import { SightingList, SightingForm, TriangulationBanner } from "./SightingPanel";

export default function AlertDetailPanel({
  report,
  estimatedZone,
  showSightingForm,
  sightingValues,
  onSightingChange,
  onSightingSubmit,
  onToggleSightingForm,
  onContact,
  onShare,
}) {
  if (!report) return null;

  const sightings = report.sightings ?? [];
  const radiusMeters = estimatedZone ? Math.round(estimatedZone.radius * 50) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-start gap-4 mb-6">
        <Avatar icon={report.icon} size="lg" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">{report.petName}</h2>
          <p className="text-emerald-600 font-medium">{report.breed} · {report.species}</p>
          <p className="text-slate-600 mt-2">{report.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="warning">Última vez: {report.lastSeenDate}</Badge>
            <Badge>{report.lastSeen}</Badge>
            {report.reward && <Badge variant="success">Recompensa: {report.reward}</Badge>}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-slate-800 mb-2">Mapa de avistamientos</h3>
        <p className="text-sm text-slate-500 mb-3">
          Zona probable según {sightings.length} reporte(s)
        </p>
        <SightingMap sightings={sightings} estimated={estimatedZone} />
      </div>

      {estimatedZone && (
        <div className="mb-6">
          <TriangulationBanner
            petName={report.petName}
            lastSeen={report.lastSeen}
            radiusMeters={radiusMeters}
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">Avistamientos ({sightings.length})</h3>
        <button
          type="button"
          onClick={onToggleSightingForm}
          className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <Icon name="plus" size={16} />
          Reportar avistamiento
        </button>
      </div>

      {showSightingForm && (
        <div className="mb-4">
          <SightingForm
            values={sightingValues}
            onChange={onSightingChange}
            onSubmit={onSightingSubmit}
            onCancel={onToggleSightingForm}
          />
        </div>
      )}

      <SightingList sightings={sightings} />

      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onContact}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <Icon name="phone" size={18} />
          Contactar dueño
        </button>
        <button
          type="button"
          onClick={onShare}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
        >
          <Icon name="share" size={18} />
          Compartir alerta
        </button>
      </div>
    </div>
  );
}
