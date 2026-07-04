export default function SightingMap({ sightings, estimated }) {
  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-emerald-50 to-sky-50 rounded-2xl border-2 border-dashed border-emerald-200 overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {estimated && (
        <div
          className="absolute rounded-full border-2 border-amber-400 bg-amber-200/30 animate-pulse"
          style={{
            left: `${estimated.lng}%`,
            top: `${estimated.lat}%`,
            width: `${estimated.radius * 2}%`,
            height: `${estimated.radius * 2}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {estimated && (
        <div
          className="absolute w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg z-10"
          style={{
            left: `${estimated.lng}%`,
            top: `${estimated.lat}%`,
            transform: "translate(-50%, -50%)",
          }}
          title="Zona probable"
        />
      )}

      {sightings.map((s) => (
        <div
          key={s.id}
          className="absolute z-20 group"
          style={{ left: `${s.lng}%`, top: `${s.lat}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md cursor-pointer" />
          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-lg shadow-lg p-2 text-xs z-30">
            <p className="font-semibold text-slate-800">{s.author}</p>
            <p className="text-slate-500 mt-0.5">{s.comment}</p>
            <p className="text-slate-400 mt-1">{s.time}</p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 left-3 flex gap-3 text-xs bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> Avistamiento</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full" /> Zona probable</span>
      </div>
    </div>
  );
}
