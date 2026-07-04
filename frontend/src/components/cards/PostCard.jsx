import Avatar from "../ui/Avatar";
import Icon from "../icons/Icons";

export default function PostCard({ post }) {
  const {
    petName = "Firulais",
    species = "Perro",
    breed = "Cruza / Golden",
    lastSeen = "Sonsonate Centro",
    description = "Visto corriendo cerca del parque central. Trae un collar azul sin placa. Es muy dócil pero está asustado.",
    status = "lost",
    ownerPhone = "+503 7777-0000"
  } = post || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar icon={species === "Gato" ? "cat" : "dog"} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm">{petName}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                status === "lost" 
                  ? "bg-red-50 text-[#EF4444] border border-red-100" 
                  : "bg-emerald-50 text-[#22C55E] border border-emerald-100"
              }`}>
                {status === "lost" ? "Perdido" : "Avistado"}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Icon name="pin" size={13} />
              {lastSeen}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Mas opciones"
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
        >
          <Icon name="more" size={18} />
        </button>
      </div>

      <div className="w-full bg-slate-50 aspect-video flex items-center justify-center relative border-y border-slate-50">
        <div className="text-center p-6">
          <div className="mx-auto mb-3 h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
            <Icon name={species === "Gato" ? "cat" : "dog"} size={34} />
          </div>
          <p className="text-xs font-semibold text-slate-400">{breed} / {species}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>

        <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-slate-500 text-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer font-medium"
            >
              <Icon name="heart" size={15} />
              12 Me gusta
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 hover:text-sky-500 transition-colors cursor-pointer font-medium"
            >
              <Icon name="comment" size={15} />
              4 Comentarios
            </button>
          </div>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Icon name="phone" size={14} />
            {ownerPhone}
          </span>
        </div>
      </div>
    </div>
  );
}
