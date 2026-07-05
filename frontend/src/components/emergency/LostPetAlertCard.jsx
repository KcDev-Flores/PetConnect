import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

export default function LostPetAlertCard({ report, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(report)}
      className={`w-full text-left bg-white rounded-2xl border p-4 transition-all ${
        isSelected
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
          <p className="text-xs text-slate-400 mt-1">{report.sightingsCount ?? report.sightings?.length ?? 0} avistamientos</p>
        </div>
      </div>
    </button>
  );
}
