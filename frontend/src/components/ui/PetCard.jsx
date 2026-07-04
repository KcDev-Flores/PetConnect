import Avatar from "./Avatar";
import Badge from "./Badge";

export default function PetCard({ pet, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left w-full hover:shadow-md hover:border-emerald-200 transition-all group"
    >
      <div className="flex items-start gap-4">
        <Avatar icon={pet.icon} size="lg" color={pet.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors">
              {pet.name}
            </h3>
            <Badge variant="info">{pet.species}</Badge>
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
