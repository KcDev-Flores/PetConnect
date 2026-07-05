import Avatar from "./Avatar";
import Badge from "./Badge";

const LOCAL_ALERTS_KEY = "petconnect:lost-alert-posts";

function isPetLost(petId) {
  try {
    const alerts = JSON.parse(localStorage.getItem(LOCAL_ALERTS_KEY)) ?? [];
    return alerts.some((alert) => String(alert.petId) === String(petId));
  } catch {
    return false;
  }
}

export default function PetCard({ pet, onClick }) {
  const lost = isPetLost(pet.id);
  const frameClass = lost ? "border-red-400 ring-red-200" : "border-emerald-400 ring-emerald-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left w-full hover:shadow-md hover:border-emerald-200 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 rounded-2xl border-2 bg-white p-1 shadow-md ring-2 ${frameClass}`}>
          {pet.photoUrl ? (
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="h-20 w-20 rounded-xl object-cover"
            />
          ) : (
            <Avatar icon={pet.icon} size="lg" color={pet.color} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">
              {pet.name}
            </h3>
            <Badge variant="info">{pet.species}</Badge>
            {lost && <Badge variant="danger">Perdido</Badge>}
          </div>
          <p className="text-emerald-600 font-medium text-sm mt-0.5">{pet.breed}</p>
          <p className="text-slate-500 text-sm mt-2 line-clamp-2">{pet.bio}</p>
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span>{pet.followers} seguidores</span>
            <span>{pet.posts} publicaciones</span>
            <span>{pet.age}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
