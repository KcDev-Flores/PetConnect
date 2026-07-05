import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import Avatar from "../components/ui/Avatar";
import PetCard from "../components/ui/PetCard";
import Icon from "../components/icons/Icons";
import { FormField, inputClass, textareaClass } from "../components/ui/FormPrimitives";
import { createOwnedPet, loadOwnedPets, saveOwnedPets } from "../data/localPets";

const activityItems = [
  { icon: "edit", color: "bg-emerald-100 text-emerald-600", text: "Publicaste en el feed", time: "Hace 2 horas" },
  { icon: "alert", color: "bg-red-100 text-red-500", text: "Reportaste un avistamiento de Toby", time: "Ayer" },
  { icon: "users", color: "bg-sky-100 text-sky-600", text: "Seguiste a Rocky", time: "Hace 3 días" },
];

const emptyPetForm = {
  name: "",
  species: "Perro",
  breed: "",
  age: "",
  bio: "",
  photoUrl: "",
  passportCode: "",
  microchip: "",
  issuedAt: "",
  passportStatus: "Verificado",
};

export default function Profile() {
  const { currentUser, userPets } = useProfile();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-emerald-400 via-sky-400 to-slate-800" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative ring-4 ring-white rounded-2xl">
              {visibleProfile.photoUrl ? (
                <img
                  src={visibleProfile.photoUrl}
                  alt={visibleProfile.name}
                  className="h-20 w-20 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <Avatar icon={currentUser.icon} size="lg" color="#10B981" />
              )}
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-xl bg-emerald-500 text-white shadow-lg transition-colors hover:bg-emerald-600">
                  <Icon name="camera" size={17} />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoSelect}
                  />
                </label>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">{visibleProfile.name}</h1>
              <p className="text-slate-500">{visibleProfile.email}</p>
              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-4">
                <p className="flex items-center gap-1">
                  <Icon name="pin" size={14} />
                  {visibleProfile.location}
                </p>
                <p className="flex items-center gap-1">
                  <Icon name="phone" size={14} />
                  {visibleProfile.phone}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${isEditing
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-white border border-slate-200 hover:border-emerald-300 text-slate-700"
                  }`}
              >
                <Icon name={isEditing ? "check" : "edit"} size={16} />
                {isEditing ? "Guardar cambios" : "Editar perfil"}
              </button>
            </div>
          </div>

          {isEditing && (
            <form
              className="mt-6 grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditToggle();
              }}
            >
              <FormField label="Nombre completo" required>
                <input
                  value={draft.name}
                  onChange={setField("name")}
                  className={inputClass}
                  placeholder="Tu nombre"
                  required
                />
              </FormField>
              <FormField label="Correo" required>
                <input
                  type="email"
                  value={draft.email}
                  onChange={setField("email")}
                  className={inputClass}
                  placeholder="tu@email.com"
                  required
                />
              </FormField>
              <FormField label="Lugar de residencia" required>
                <input
                  value={draft.location}
                  onChange={setField("location")}
                  className={inputClass}
                  placeholder="Ciudad, país"
                  required
                />
              </FormField>
              <FormField label="Contacto" required>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={setField("phone")}
                  className={inputClass}
                  placeholder="+503 0000-0000"
                  required
                />
              </FormField>
            </form>
          )}

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
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowPetForm((current) => !current)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Icon name="plus" size={16} />
              Agregar mascota
            </button>
            <Link to="/passport" className="rounded-xl px-4 py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Ver pasaportes
            </Link>
          </div>
        </div>

        {showPetForm && (
          <form
            onSubmit={handleAddPet}
            className="mb-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon name="paw" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Nueva mascota</h3>
                <p className="text-sm text-slate-500">Esta mascota se agregara a tu perfil local.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Foto">
                <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 transition-colors hover:bg-emerald-50 md:col-span-2">
                  {petDraft.photoUrl ? (
                    <img
                      src={petDraft.photoUrl}
                      alt={petDraft.name || "Mascota"}
                      className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                    />
                  ) : (
                    <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                      <Icon name="camera" size={30} />
                    </span>
                  )}
                  <span>
                    <span className="block text-sm font-bold text-slate-800">Subir foto</span>
                    <span className="mt-1 block text-xs text-slate-500">JPG o PNG para identificarla rapido.</span>
                  </span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handlePetPhotoSelect} />
                </label>
              </FormField>

              <FormField label="Nombre" required>
                <input
                  value={petDraft.name}
                  onChange={setPetField("name")}
                  className={inputClass}
                  placeholder="Ej: Nala"
                  required
                />
              </FormField>
              <FormField label="Especie" required>
                <select value={petDraft.species} onChange={setPetField("species")} className={inputClass} required>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
              </FormField>
              <FormField label="Raza" required>
                <input
                  value={petDraft.breed}
                  onChange={setPetField("breed")}
                  className={inputClass}
                  placeholder="Ej: Labrador"
                  required
                />
              </FormField>
              <FormField label="Edad" required>
                <input
                  value={petDraft.age}
                  onChange={setPetField("age")}
                  className={inputClass}
                  placeholder="Ej: 2 años"
                  required
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Biografia" required>
                  <textarea
                    value={petDraft.bio}
                    onChange={setPetField("bio")}
                    className={textareaClass}
                    rows={3}
                    placeholder="Personalidad, senas, gustos o informacion importante."
                    required
                  />
                </FormField>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Icon name="passport" size={20} className="text-emerald-700" />
                  <div>
                    <h4 className="font-bold text-emerald-900">Pasaporte digital</h4>
                    <p className="text-xs text-emerald-700">
                      Datos que apareceran en el pasaporte de la mascota.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="ID del pasaporte">
                    <input
                      value={petDraft.passportCode}
                      onChange={setPetField("passportCode")}
                      className={inputClass}
                      placeholder="Ej: PC-000004"
                    />
                  </FormField>
                  <FormField label="Microchip">
                    <input
                      value={petDraft.microchip}
                      onChange={setPetField("microchip")}
                      className={inputClass}
                      placeholder="Ej: SV-2026-4304"
                    />
                  </FormField>
                  <FormField label="Emision">
                    <input
                      value={petDraft.issuedAt}
                      onChange={setPetField("issuedAt")}
                      className={inputClass}
                      placeholder="Ej: Julio 2026"
                    />
                  </FormField>
                  <FormField label="Estado">
                    <select
                      value={petDraft.passportStatus}
                      onChange={setPetField("passportStatus")}
                      className={inputClass}
                    >
                      <option value="Verificado">Verificado</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revision">En revision</option>
                    </select>
                  </FormField>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPetDraft(emptyPetForm);
                  setShowPetForm(false);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Guardar mascota
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {userPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onClick={() => navigate(`/passport?pet=${pet.id}`)}
            />
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
              {item.text} <span className="text-slate-400">{item.time}</span>
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
