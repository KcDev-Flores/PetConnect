export default function SearchBar() {
  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
      <span className="text-slate-400 text-lg">🔍</span>
      <input 
        type="text" 
        placeholder="Buscar reportes o coincidencias en Sonsonate, Izalco..." 
        className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
      />
      <button className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer text-xs font-semibold text-slate-600">
        Filtros
      </button>
    </div>
  );
}