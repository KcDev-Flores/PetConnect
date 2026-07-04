import { useState } from "react";
import { pets, breeds } from "../data/mockData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

export default function Passport() {
  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...selectedPet });

  const handleSave = () => {
    setSelectedPet({ ...form });
    setIsEditing(false);
  };

  const breedInfo = breeds.find((b) => b.name === selectedPet.breed);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pasaporte de Mascota</h1>
          <p className="text-slate-500 mt-1">Perfil digital con raza, datos y historial</p>
        </div>
        <button
          type="button"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm self-start"
        >
          {isEditing ? "Guardar cambios" : "Editar perfil"}
        </button>
      </header>

      <div className="flex gap-2 flex-wrap">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => { setSelectedPet(pet); setForm({ ...pet }); setIsEditing(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedPet.id === pet.id
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            {pet.avatar} {pet.name}
          </button>
        ))}
        <button
          type="button"
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-white text-emerald-600 border border-dashed border-emerald-300 hover:bg-emerald-50 transition-all"
        >
          + Nueva mascota
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="px-6 pb-6 -mt-12">
            <Avatar emoji={selectedPet.avatar} size="xl" color={selectedPet.color} />
            <div className="mt-4">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none font-bold text-xl"
                  />
                  <select
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  >
                    {breeds.map((b) => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none resize-none"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedPet.name}</h2>
                  <p className="text-emerald-600 font-medium">{selectedPet.breed}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{selectedPet.species}</Badge>
                    <Badge>{selectedPet.age}</Badge>
                  </div>
                  <p className="text-slate-600 mt-4 leading-relaxed">{selectedPet.bio}</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{selectedPet.posts}</p>
                <p className="text-xs text-slate-400">Publicaciones</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{selectedPet.followers}</p>
                <p className="text-xs text-slate-400">Seguidores</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">✓</p>
                <p className="text-xs text-slate-400">Verificado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {breedInfo && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-800 mb-3">Info de la raza</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Especie</dt>
                  <dd className="font-medium">{breedInfo.species}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Tamaño</dt>
                  <dd className="font-medium">{breedInfo.size}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Origen</dt>
                  <dd className="font-medium">{breedInfo.origin}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-3">Dueño</h3>
            <p className="text-slate-600">{selectedPet.owner}</p>
          </div>

          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
            <h3 className="font-bold text-emerald-800 mb-2">Pasaporte digital</h3>
            <p className="text-sm text-emerald-700">
              ID: PC-{String(selectedPet.id).padStart(6, "0")}
            </p>
            <div className="mt-3 h-16 bg-white rounded-lg flex items-center justify-center text-4xl tracking-widest opacity-60">
              ▮▮▮▮▮▮
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
