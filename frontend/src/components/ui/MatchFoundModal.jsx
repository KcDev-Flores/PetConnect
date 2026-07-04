import Icon from "../icons/Icons";

export default function MatchFoundModal({ open, match, onClose, onContact }) {
  if (!open || !match) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Icon name="check" size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold">Match encontrado</h2>
          <p className="text-emerald-100 mt-2 text-sm">
            La IA detectó una coincidencia en la base de datos
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Mascota</p>
            <p className="text-lg font-bold text-slate-800 mt-1">{match.petName}</p>
            <p className="text-emerald-700 font-medium">{match.breed}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400">Dueño</p>
              <p className="font-semibold text-slate-800">{match.owner}</p>
            </div>
            <div>
              <p className="text-slate-400">Confianza IA</p>
              <p className="font-semibold text-emerald-600">{match.confidence}%</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onContact}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors"
            >
              <Icon name="phone" size={18} />
              Contactar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
