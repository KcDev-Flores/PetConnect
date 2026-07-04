import { useState } from "react";
import { usePets } from "../hooks/usePets";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";

function PetModelStage({ pet }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-950 p-4 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">R3F ready</p>
          <h3 className="text-white font-bold">Modelo 3D</h3>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-emerald-200">
          <Icon name="spark" size={20} />
        </div>
      </div>

      <div
        id="pet-r3f-stage"
        data-r3f-ready="true"
        className="relative grid aspect-[4/5] min-h-[300px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_28%,rgba(16,185,129,0.38),transparent_34%),linear-gradient(145deg,#0f172a,#111827_45%,#042f2e)]"
      >
        <div className="absolute inset-x-8 bottom-10 h-14 rounded-full bg-emerald-300/20 blur-xl" />
        <div className="relative grid h-40 w-40 place-items-center rounded-[2rem] border border-white/15 bg-white/10 text-emerald-100 shadow-2xl backdrop-blur">
          <Icon name={pet.icon} size={78} />
        </div>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur">
          <p className="text-sm font-bold">{pet.name}</p>
          <p className="text-xs text-slate-300">{pet.breed}</p>
        </div>
      </div>
    </section>
  );
}

export default function Passport() {
  const { pets, breeds, savePet, loading } = usePets();
  const [selectedPet, setSelectedPet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);

  // Initialize selected pet once pets are loaded
  if (!selectedPet && pets.length > 0) {
    setSelectedPet(pets[0]);
    setForm({ ...pets[0] });
  }

  const handleSave = async () => {
    await savePet(form);
    setSelectedPet({ ...form });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Cargando pasaportes...</p>
      </div>
    );
  }

  if (!selectedPet) return null;

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
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm self-start"
        >
          <Icon name={isEditing ? "check" : "edit"} size={18} />
          {isEditing ? "Guardar cambios" : "Editar perfil"}
        </button>
      </header>

      <div className="flex gap-2 flex-wrap">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => { setSelectedPet(pet); setForm({ ...pet }); setIsEditing(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedPet.id === pet.id
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            <Icon name={pet.icon} size={16} className={selectedPet.id === pet.id ? "text-white" : "text-emerald-600"} />
            {pet.name}
          </button>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-emerald-600 border border-dashed border-emerald-300 hover:bg-emerald-50 transition-all"
        >
          <Icon name="plus" size={16} />
          Nueva mascota
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-emerald-400 via-sky-400 to-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(120deg,transparent_0%,white_45%,transparent_70%)]" />
          </div>
          <div className="px-6 pb-6 -mt-12">
            <Avatar icon={selectedPet.icon} size="xl" color={selectedPet.color} />
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
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{selectedPet.posts}</p>
                <p className="text-xs text-slate-400">Publicaciones</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{selectedPet.followers}</p>
                <p className="text-xs text-slate-400">Seguidores</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center flex flex-col items-center">
                <Icon name="check" size={28} className="text-emerald-500" />
                <p className="text-xs text-emerald-700 mt-1 font-semibold">Verificado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <PetModelStage pet={selectedPet} />

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
            <div className="flex items-center gap-2 mb-2">
              <Icon name="passport" size={20} className="text-emerald-700" />
              <h3 className="font-bold text-emerald-800">Pasaporte digital</h3>
            </div>
            <p className="text-sm text-emerald-700">
              ID: PC-{String(selectedPet.id).padStart(6, "0")}
            </p>
            <div className="mt-3 h-16 bg-white rounded-lg flex items-center justify-center text-emerald-700">
              <Icon name="qr" size={42} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
