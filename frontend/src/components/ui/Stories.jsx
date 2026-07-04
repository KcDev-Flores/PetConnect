import Icon from "../icons/Icons";

export default function Stories() {
  const stories = [
    { id: 1, name: "Añadir", icon: "plus", isUser: true },
    { id: 2, name: "Max (Izalco)", icon: "dog", active: true },
    { id: 3, name: "Cleo (Colón)", icon: "cat", active: true },
    { id: 4, name: "Rocky (Sonsonate)", icon: "dog", active: false },
    { id: 5, name: "Bella (Juayúa)", icon: "paw", active: false },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-3 pt-1 select-none">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
          <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-transform active:scale-95 bg-white shadow-sm border ${
            story.isUser 
              ? "border-dashed border-slate-300 text-slate-400" 
              : story.active 
                ? "border-2 border-emerald-400 p-0.5" 
                : "border-slate-200"
          }`}>
            <div className={`h-full w-full rounded-full flex items-center justify-center ${story.active ? "bg-emerald-50 text-emerald-600" : "text-slate-500"}`}>
              <Icon name={story.icon} size={24} />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium max-w-[72px] truncate">
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
