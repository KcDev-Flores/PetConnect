import { Link } from "react-router-dom";
import { currentUser, pets } from "../data/mockData";
import Avatar from "../components/ui/Avatar";
import PetCard from "../components/ui/PetCard";
import Icon from "../components/icons/Icons";

const activityItems = [
  { icon: "edit", color: "bg-emerald-100 text-emerald-600", text: "Publicaste en el feed", time: "Hace 2 horas" },
  { icon: "alert", color: "bg-red-100 text-red-500", text: "Reportaste un avistamiento de Toby", time: "Ayer" },
  { icon: "users", color: "bg-sky-100 text-sky-600", text: "Seguiste a Rocky", time: "Hace 3 días" },
];

export default function Profile() {
  const userPets = pets.filter((p) => currentUser.pets.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-violet-400 to-purple-500" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="ring-4 ring-white rounded-2xl">
              <Avatar icon={currentUser.icon} size="lg" color="#8B5CF6" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
              <p className="text-slate-500">{currentUser.email}</p>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                <Icon name="pin" size={14} />
                {currentUser.location}
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 font-semibold rounded-xl text-sm transition-colors self-start"
            >
              <Icon name="edit" size={16} />
              Editar perfil
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 max-w-md">
            <div>
              <p className="text-2xl font-bold text-slate-800">{userPets.length}</p>
              <p className="text-xs text-slate-400">Mascotas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">128</p>
              <p className="text-xs text-slate-400">Seguidores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">45</p>
              <p className="text-xs text-slate-400">Siguiendo</p>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Mis mascotas</h2>
          <Link to="/passport" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            Ver pasaportes →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {userPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Actividad reciente</h2>
        <ul className="space-y-3">
          {activityItems.map((item) => (
            <li key={item.text} className="flex items-center gap-3 text-sm text-slate-600">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                <Icon name={item.icon} size={16} />
              </span>
              {item.text} — <span className="text-slate-400">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-slate-400 text-center">
        Miembro desde {currentUser.joined}
      </p>
    </div>
  );
}
