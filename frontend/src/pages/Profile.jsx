import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { usePets } from "../hooks/usePets";
import Avatar from "../components/ui/Avatar";
import PetCard from "../components/ui/PetCard";
import Icon from "../components/icons/Icons";
import { FormField, inputClass, textareaClass } from "../components/ui/FormPrimitives";
import { createOwnedPet, loadDeletedOwnedPetIds, loadOwnedPets, saveDeletedOwnedPetIds, saveOwnedPets } from "../data/localPets";

const LOCAL_ALERTS_KEY = "petconnect:lost-alert-posts";

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
  clinic: "",
  veterinarian: "",
  license: "",
  vetPhone: "",
  vetEmail: "",
  vetAddress: "",
  lastCheckup: "",
  nextCheckup: "",
  medicalNotes: "",
  travelDestination: "",
  rabiesVaccine: "Vigente",
  healthCertificate: "",
  exportPermit: "",
  parasiteTreatment: "",
  microchipStandard: "ISO 11784/11785",
  airlineCrate: "",
  travelNotes: "",
};

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function optimizePetPhoto(file) {
  const originalImage = await readImageAsDataUrl(file);
  const image = new Image();

  return new Promise((resolve) => {
    image.onload = () => {
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    image.onerror = () => resolve(originalImage);
    image.src = originalImage;
  });
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const { pets: apiPets } = usePets();

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || "Usuario Anónimo",
    email: user?.email || "",
    location: user?.user_metadata?.location || "Sin especificar",
    phone: user?.user_metadata?.phone || "",
    photoUrl: user?.user_metadata?.photoUrl || "",
  });
  const [draft, setDraft] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [ownedExtraPets, setOwnedExtraPets] = useState(() => loadOwnedPets());
  const [deletedPetIds, setDeletedPetIds] = useState(() => loadDeletedOwnedPetIds());
  const [showPetForm, setShowPetForm] = useState(false);
  const [petDraft, setPetDraft] = useState(emptyPetForm);

  const userPets = [
    ...apiPets.filter((p) => !deletedPetIds.some((id) => String(id) === String(p.id))),
    ...ownedExtraPets,
  ];

  const setField = (field) => (e) => {
    setDraft((current) => ({ ...current, [field]: e.target.value }));
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Usar base64 (optimizePetPhoto) para que persista en Supabase
    // URL.createObjectURL solo sirve localmente hasta refrescar
    const photoUrl = await optimizePetPhoto(file);
    setDraft((current) => ({ ...current, photoUrl }));
  };

  const [saving, setSaving] = useState(false);

  const handleEditToggle = async () => {
    if (isEditing) {
      setSaving(true);
      try {
        await updateProfile({
          name: draft.name,
          location: draft.location,
          phone: draft.phone,
          photoUrl: draft.photoUrl
        });
        setProfile(draft);
        setIsEditing(false);
      } catch (err) {
        console.error("Error al actualizar perfil:", err);
        alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
      } finally {
        setSaving(false);
      }
      return;
    }

    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const setPetField = (field) => (e) => {
    setPetDraft((current) => ({ ...current, [field]: e.target.value }));
  };

  const handlePetPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const photoUrl = await optimizePetPhoto(file);
    setPetDraft((current) => ({ ...current, photoUrl }));
  };

  const handleAddPet = (e) => {
    e.preventDefault();

    const nextPet = createOwnedPet(petDraft, profile.name);
    const nextPets = [...ownedExtraPets, nextPet];
    const savedPets = saveOwnedPets(nextPets);

    setOwnedExtraPets(savedPets);
    setPetDraft(emptyPetForm);
    setShowPetForm(false);
  };

  const removeLostAlertsForPet = (petId) => {
    try {
      const alerts = JSON.parse(localStorage.getItem(LOCAL_ALERTS_KEY)) ?? [];
      const nextAlerts = alerts.filter((alert) => String(alert.petId) !== String(petId));
      localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(nextAlerts));
      window.dispatchEvent(new Event("petconnect:lost-alerts-updated"));
    } catch {
      localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify([]));
    }
  };

  const handleDeletePet = (pet) => {
    const confirmed = window.confirm(`Eliminar a ${pet.name} de tu perfil? Esta accion quitara su pasaporte y alertas activas.`);
    if (!confirmed) return;

    const nextOwnedExtraPets = ownedExtraPets.filter((ownedPet) => String(ownedPet.id) !== String(pet.id));
    if (nextOwnedExtraPets.length !== ownedExtraPets.length) {
      const savedPets = saveOwnedPets(nextOwnedExtraPets);
      setOwnedExtraPets(savedPets);
    }

    if (apiPets.some((petId) => String(petId) === String(pet.id))) {
      const nextDeletedPetIds = deletedPetIds.some((petId) => String(petId) === String(pet.id))
        ? deletedPetIds
        : [...deletedPetIds, pet.id];

      setDeletedPetIds(nextDeletedPetIds);
      saveDeletedOwnedPetIds(nextDeletedPetIds);
    }

    removeLostAlertsForPet(pet.id);
  };

  const visibleProfile = isEditing ? draft : profile;

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
                <Avatar icon="user" size="lg" color="#10B981" />
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
              <p className="text-slate-500 mt-1">{visibleProfile.email}</p>
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
            <div className="flex flex-wrap gap-2 self-start sm:self-center mt-2 sm:mt-0">
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
                disabled={saving}
                className={`flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors ${isEditing
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
                  : "bg-white border border-slate-200 hover:border-emerald-300 text-slate-700"
                  }`}
              >
                <Icon name={isEditing ? (saving ? "more" : "check") : "edit"} size={16} />
                {isEditing ? (saving ? "Guardando..." : "Guardar cambios") : "Editar perfil"}
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
              <p className="text-2xl font-bold text-slate-800">0</p>
              <p className="text-xs text-slate-400">Seguidores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">0</p>
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

              <div className="md:col-span-2 rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Icon name="activity" size={20} className="text-sky-700" />
                  <div>
                    <h4 className="font-bold text-sky-950">Veterinario y salud</h4>
                    <p className="text-xs text-sky-700">
                      Informacion medica que aparecera en el perfil de la mascota.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Clinica veterinaria">
                    <input
                      value={petDraft.clinic}
                      onChange={setPetField("clinic")}
                      className={inputClass}
                      placeholder="Ej: Clinica Animal Care"
                    />
                  </FormField>
                  <FormField label="Veterinario responsable">
                    <input
                      value={petDraft.veterinarian}
                      onChange={setPetField("veterinarian")}
                      className={inputClass}
                      placeholder="Ej: Dra. Ana Lopez"
                    />
                  </FormField>
                  <FormField label="Registro profesional">
                    <input
                      value={petDraft.license}
                      onChange={setPetField("license")}
                      className={inputClass}
                      placeholder="Ej: JVPM-1234"
                    />
                  </FormField>
                  <FormField label="Telefono veterinario">
                    <input
                      value={petDraft.vetPhone}
                      onChange={setPetField("vetPhone")}
                      className={inputClass}
                      placeholder="+503 0000-0000"
                    />
                  </FormField>
                  <FormField label="Correo veterinario">
                    <input
                      type="email"
                      value={petDraft.vetEmail}
                      onChange={setPetField("vetEmail")}
                      className={inputClass}
                      placeholder="clinica@email.com"
                    />
                  </FormField>
                  <FormField label="Direccion de clinica">
                    <input
                      value={petDraft.vetAddress}
                      onChange={setPetField("vetAddress")}
                      className={inputClass}
                      placeholder="Ciudad, pais"
                    />
                  </FormField>
                  <FormField label="Ultimo chequeo">
                    <input
                      value={petDraft.lastCheckup}
                      onChange={setPetField("lastCheckup")}
                      className={inputClass}
                      placeholder="Ej: Julio 2026"
                    />
                  </FormField>
                  <FormField label="Proximo chequeo">
                    <input
                      value={petDraft.nextCheckup}
                      onChange={setPetField("nextCheckup")}
                      className={inputClass}
                      placeholder="Ej: Enero 2027"
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Notas medicas">
                      <textarea
                        value={petDraft.medicalNotes}
                        onChange={setPetField("medicalNotes")}
                        className={textareaClass}
                        rows={3}
                        placeholder="Alergias, tratamientos, observaciones o cuidados especiales."
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Icon name="passport" size={20} className="text-amber-700" />
                  <div>
                    <h4 className="font-bold text-amber-950">Viaje internacional</h4>
                    <p className="text-xs text-amber-700">
                      Requisitos y documentos necesarios para viajar a otro pais.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Pais destino">
                    <input
                      value={petDraft.travelDestination}
                      onChange={setPetField("travelDestination")}
                      className={inputClass}
                      placeholder="Ej: Estados Unidos"
                    />
                  </FormField>
                  <FormField label="Vacuna contra la rabia">
                    <input
                      value={petDraft.rabiesVaccine}
                      onChange={setPetField("rabiesVaccine")}
                      className={inputClass}
                      placeholder="Ej: Vigente"
                    />
                  </FormField>
                  <FormField label="Certificado internacional de salud">
                    <input
                      value={petDraft.healthCertificate}
                      onChange={setPetField("healthCertificate")}
                      className={inputClass}
                      placeholder="Ej: Pendiente de emision"
                    />
                  </FormField>
                  <FormField label="Permiso sanitario de exportacion">
                    <input
                      value={petDraft.exportPermit}
                      onChange={setPetField("exportPermit")}
                      className={inputClass}
                      placeholder="Ej: Pendiente"
                    />
                  </FormField>
                  <FormField label="Desparasitacion">
                    <input
                      value={petDraft.parasiteTreatment}
                      onChange={setPetField("parasiteTreatment")}
                      className={inputClass}
                      placeholder="Ej: 24-48h antes del viaje"
                    />
                  </FormField>
                  <FormField label="Estandar de microchip">
                    <input
                      value={petDraft.microchipStandard}
                      onChange={setPetField("microchipStandard")}
                      className={inputClass}
                      placeholder="ISO 11784/11785"
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Requisitos de aerolinea">
                      <input
                        value={petDraft.airlineCrate}
                        onChange={setPetField("airlineCrate")}
                        className={inputClass}
                        placeholder="Ej: Transportadora IATA validada"
                      />
                    </FormField>
                  </div>
                  <div className="md:col-span-2">
                    <FormField label="Notas de viaje">
                      <textarea
                        value={petDraft.travelNotes}
                        onChange={setPetField("travelNotes")}
                        className={textareaClass}
                        rows={3}
                        placeholder="Requisitos de embajada, aerolinea, cuarentena o autoridad sanitaria."
                      />
                    </FormField>
                  </div>
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
            <div key={pet.id} className="group relative">
              <PetCard
                pet={pet}
                onClick={() => navigate(`/passport?pet=${pet.id}`)}
              />
              <button
                type="button"
                onClick={() => handleDeletePet(pet)}
                className="absolute right-4 top-4 flex items-center gap-1.5 rounded-xl border border-red-100 bg-white/95 px-3 py-2 text-xs font-black text-red-600 shadow-sm transition-all hover:bg-red-500 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Eliminar a ${pet.name}`}
              >
                <Icon name="close" size={14} />
                Eliminar
              </button>
            </div>
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
        Miembro desde {user ? new Date(user.created_at).getFullYear() : "Recientemente"}
      </p>
    </div>
  );
}
