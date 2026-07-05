import Icon from "../icons/Icons";

export default function Stories() {
  const stories = [
    { id: 1, name: "Tu historia", icon: "plus", isUser: true },
    { id: 2, name: "Max", place: "Izalco", icon: "dog", active: true, color: "#F59E0B" },
    { id: 3, name: "Cleo", place: "Colon", icon: "cat", active: true, color: "#38BDF8" },
    { id: 4, name: "Rocky", place: "Sonsonate", icon: "dog", active: true, color: "#EC4899" },
    { id: 5, name: "Bella", place: "Juayua", icon: "paw", active: false, color: "#10B981" },
    { id: 6, name: "Michi", place: "Cuscatlan", icon: "cat", active: false, color: "#8B5CF6" },
  ];

  return (
    <div className="flex gap-5 overflow-x-auto px-1 pb-3 pt-1 select-none">
      {stories.map((story) => (
        <button key={story.id} type="button" className="group flex w-[78px] shrink-0 flex-col items-center gap-2">
          <div
            className={`relative grid h-[70px] w-[70px] place-items-center rounded-full p-[3px] transition-transform group-active:scale-95 ${
              story.isUser
                ? "bg-slate-200"
                : story.active
                  ? "bg-gradient-to-tr from-amber-400 via-rose-400 to-emerald-400"
                  : "bg-slate-200"
            }`}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-white p-1">
              <div
                className="grid h-full w-full place-items-center rounded-full text-emerald-700 shadow-inner"
                style={{ backgroundColor: story.color ? `${story.color}22` : "#F8FAFC" }}
              >
                <Icon name={story.icon} size={story.isUser ? 22 : 26} />
              </div>
            </div>
            {story.isUser && (
              <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white">
                <Icon name="plus" size={13} />
              </span>
            )}
          </div>
          <span className="max-w-[78px] truncate text-center text-xs font-semibold leading-tight text-slate-700">
            {story.name}
            {story.place && <span className="block text-[10px] font-medium text-slate-400">{story.place}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
