import { useState } from "react";
<<<<<<< HEAD
import { Link, useSearchParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { pets, breeds, currentUser } from "../data/mockData";
=======
import { usePets } from "../hooks/usePets";
>>>>>>> origin/Charlie
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";
import { FormField, inputClass, textareaClass } from "../components/ui/FormPrimitives";
import { loadOwnedPets } from "../data/localPets";

function getModelProfile(pet, fileName = "") {
  const text = `${pet.name} ${pet.species} ${pet.breed} ${fileName}`.toLowerCase();
  const species = text.includes("gato") || text.includes("cat") || text.includes("michi")
    ? "Gato"
    : "Perro";

  const coat = text.includes("negro")
    ? "#111827"
    : text.includes("blanco")
      ? "#F8FAFC"
      : text.includes("dorado") || text.includes("golden")
        ? "#D97706"
        : pet.color || "#10B981";

  return {
    species,
    coat,
    accent: species === "Gato" ? "#38BDF8" : "#10B981",
    confidence: fileName ? 0.86 : 0.72,
    source: fileName ? "Foto subida" : "Datos del perfil",
  };
}

function createPassportInfo(pet) {
  return {
    code: `PC-${String(pet.id).padStart(6, "0")}`,
    microchip: `SV-2026-${String(4300 + pet.id)}`,
    issuedAt: "Julio 2026",
    status: "Verificado",
  };
}

function GeneratedPetMesh({ profile }) {
  const isCat = profile.species === "Gato";

  return (
    <group rotation={[0, -0.35, 0]} position={[0, -0.15, 0]}>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshStandardMaterial color={profile.coat} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.86, 0.08]}>
        <sphereGeometry args={[0.48, 40, 40]} />
        <meshStandardMaterial color={profile.coat} roughness={0.5} />
      </mesh>

      {isCat ? (
        <>
          <mesh position={[-0.28, 1.28, 0.08]} rotation={[0, 0, -0.25]}>
            <coneGeometry args={[0.18, 0.42, 4]} />
            <meshStandardMaterial color={profile.coat} roughness={0.55} />
          </mesh>
          <mesh position={[0.28, 1.28, 0.08]} rotation={[0, 0, 0.25]}>
            <coneGeometry args={[0.18, 0.42, 4]} />
            <meshStandardMaterial color={profile.coat} roughness={0.55} />
          </mesh>
          <mesh position={[0.82, 0.15, -0.08]} rotation={[0.2, 0, -0.9]}>
            <torusGeometry args={[0.34, 0.055, 16, 56, 4.4]} />
            <meshStandardMaterial color={profile.coat} roughness={0.5} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.38, 1.08, 0.02]} rotation={[0, 0, 0.55]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color={profile.coat} roughness={0.55} />
          </mesh>
          <mesh position={[0.38, 1.08, 0.02]} rotation={[0, 0, -0.55]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color={profile.coat} roughness={0.55} />
          </mesh>
          <mesh position={[0.82, 0.1, -0.12]} rotation={[0.25, 0, -0.65]}>
            <torusGeometry args={[0.32, 0.06, 16, 56, 3.4]} />
            <meshStandardMaterial color={profile.coat} roughness={0.55} />
          </mesh>
        </>
      )}

      {[-0.38, 0.38].map((x) => (
        <mesh key={`eye-${x}`} position={[x, 0.98, 0.46]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      ))}

      <mesh position={[0, 0.82, 0.5]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#020617" />
      </mesh>

      {[-0.42, 0.42].map((x) => (
        <mesh key={`leg-${x}`} position={[x, -0.58, 0.28]}>
          <cylinderGeometry args={[0.11, 0.14, 0.62, 20]} />
          <meshStandardMaterial color={profile.coat} roughness={0.6} />
        </mesh>
      ))}

      <mesh position={[0, -0.94, 0.28]} scale={[1.1, 0.18, 0.46]}>
        <sphereGeometry args={[0.42, 32, 18]} />
        <meshStandardMaterial color={profile.accent} roughness={0.4} />
      </mesh>
    </group>
  );
}

function DigitalPassportCard({ passport, isEditing, onChange }) {
  const setPassportField = (field) => (e) => {
    onChange((current) => ({
      ...current,
      passport: {
        ...current.passport,
        [field]: e.target.value,
      },
    }));
  };

  return (
    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="passport" size={20} className="text-emerald-700" />
        <h3 className="font-bold text-emerald-800">Pasaporte digital</h3>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <FormField label="ID del pasaporte" required>
            <input
              value={passport.code}
              onChange={setPassportField("code")}
              className={inputClass}
              required
            />
          </FormField>
          <FormField label="Microchip">
            <input
              value={passport.microchip}
              onChange={setPassportField("microchip")}
              className={inputClass}
              placeholder="Ej: SV-2026-4301"
            />
          </FormField>
          <FormField label="Emision">
            <input
              value={passport.issuedAt}
              onChange={setPassportField("issuedAt")}
              className={inputClass}
              placeholder="Ej: Julio 2026"
            />
          </FormField>
          <FormField label="Estado">
            <select
              value={passport.status}
              onChange={setPassportField("status")}
              className={inputClass}
            >
              <option value="Verificado">Verificado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En revision">En revision</option>
            </select>
          </FormField>
        </div>
      ) : (
        <>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-emerald-700/70">ID</dt>
              <dd className="font-bold text-emerald-900">{passport.code}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-emerald-700/70">Microchip</dt>
              <dd className="font-medium text-emerald-900">{passport.microchip}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-emerald-700/70">Emision</dt>
              <dd className="font-medium text-emerald-900">{passport.issuedAt}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-emerald-700/70">Estado</dt>
              <dd className="font-medium text-emerald-900">{passport.status}</dd>
            </div>
          </dl>
          <div className="mt-4 h-16 bg-white rounded-lg flex items-center justify-center text-emerald-700">
            <Icon name="qr" size={42} />
          </div>
        </>
      )}
    </div>
  );
}

function PetModelStage({ pet }) {
  const profile = pet.modelProfile ?? getModelProfile(pet);

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
        className="relative aspect-[4/5] min-h-[300px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_28%,rgba(16,185,129,0.38),transparent_34%),linear-gradient(145deg,#0f172a,#111827_45%,#042f2e)]"
      >
        <Canvas camera={{ position: [0, 1.2, 4.2], fov: 38 }}>
          <ambientLight intensity={1.6} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} />
          <pointLight position={[-3, 2, 3]} intensity={1.1} color={profile.accent} />
          <GeneratedPetMesh profile={profile} />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.1} />
        </Canvas>
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/10 p-3 text-white backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">{pet.name}</p>
              <p className="text-xs text-slate-300">{profile.species} generado desde {profile.source}</p>
            </div>
            <Badge variant="success">{Math.round(profile.confidence * 100)}%</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimalPassportCard({ pet, isSelected, onClick }) {
  const passport = pet.passport ?? createPassportInfo(pet);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isSelected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-100"
      }`}
    >
      <div className="relative h-28 bg-gradient-to-r from-emerald-300 via-sky-300 to-slate-700">
        {pet.photoUrl && (
          <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className="rounded-2xl bg-white p-1.5 shadow-lg">
            {pet.photoUrl ? (
              <img src={pet.photoUrl} alt={pet.name} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <Avatar icon={pet.icon} size="sm" color={pet.color} />
            )}
          </div>
          <div className="text-white">
            <p className="font-black leading-tight">{pet.name}</p>
            <p className="text-xs font-semibold text-white/80">{pet.breed}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">{pet.species}</Badge>
          <Badge>{pet.age}</Badge>
          <Badge variant={passport.status === "Verificado" ? "success" : "warning"}>{passport.status}</Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-slate-500">{pet.bio}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-slate-400">{passport.code}</span>
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
            Ver info
            <Icon name="passport" size={14} />
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Passport() {
<<<<<<< HEAD
  const [searchParams, setSearchParams] = useSearchParams();
  const [localOwnedPets] = useState(() => loadOwnedPets());
  const allPets = [...pets, ...localOwnedPets];
  const loggedPetIds = [...currentUser.pets, ...localOwnedPets.map((pet) => pet.id)];
  const requestedPet = allPets.find((pet) =>
    String(pet.id) === searchParams.get("pet") && loggedPetIds.includes(pet.id)
  );
  const initialPetId = requestedPet?.id ?? null;
  const [petProfiles, setPetProfiles] = useState(() =>
    allPets.map((pet) => ({
      ...pet,
      photoUrl: pet.photoUrl || "",
      passport: pet.passport ?? createPassportInfo(pet),
      modelProfile: pet.modelProfile ?? getModelProfile(pet),
    }))
  );
  const [selectedPetId, setSelectedPetId] = useState(initialPetId);
  const [isEditing, setIsEditing] = useState(false);
  const ownedPetProfiles = petProfiles.filter((pet) => loggedPetIds.includes(pet.id));
  const selectedPet = ownedPetProfiles.find((pet) => pet.id === selectedPetId) ?? null;
  const [form, setForm] = useState(selectedPet ? { ...selectedPet } : null);
  const canEditSelectedPet = Boolean(selectedPet && loggedPetIds.includes(selectedPet.id));

  const handleSave = () => {
    if (!canEditSelectedPet || !form) return;

    const modelProfile = form.modelProfile ?? getModelProfile(form);
    const passport = form.passport ?? createPassportInfo(form);

    setPetProfiles((current) =>
      current.map((pet) =>
        pet.id === selectedPetId ? { ...pet, ...form, passport, modelProfile } : pet
      )
    );
    setForm((current) => (current ? { ...current, passport, modelProfile } : current));
    setIsEditing(false);
  };

  const handleSelectPet = (pet) => {
    if (!loggedPetIds.includes(pet.id)) return;

    setSelectedPetId(pet.id);
    setForm({ ...pet });
    setIsEditing(false);
    setSearchParams({ pet: String(pet.id) });
  };

  const handleBackToCards = () => {
    setSelectedPetId(null);
    setForm(null);
    setIsEditing(false);
    setSearchParams({});
  };

  const handlePetPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const photoUrl = URL.createObjectURL(file);
    setForm((current) => {
      if (!current) return current;

      return {
        ...current,
        photoUrl,
        modelProfile: getModelProfile(current, file.name),
      };
    });
  };

  if (ownedPetProfiles.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon name="passport" size={26} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Sin mascotas registradas</h1>
        <p className="mt-2 text-slate-500">
          Este perfil todavia no tiene mascotas asociadas al usuario logueado.
        </p>
      </div>
    );
  }
  const visiblePet = isEditing && form ? form : selectedPet;
  const breedInfo = visiblePet ? breeds.find((b) => b.name === visiblePet.breed) : null;
  const passportInfo = visiblePet ? visiblePet.passport ?? createPassportInfo(visiblePet) : null;
=======
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
>>>>>>> origin/Charlie

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pasaporte de Mascota</h1>
          <p className="text-slate-500 mt-1">Perfil digital con raza, datos y historial</p>
        </div>
        {selectedPet && (
          canEditSelectedPet ? (
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors text-sm self-start"
            >
              <Icon name={isEditing ? "check" : "edit"} size={18} />
              {isEditing ? "Guardar cambios" : "Editar perfil"}
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500">
              <Icon name="shield" size={17} />
              Solo el dueño puede editar
            </div>
          )
        )}
      </header>

      {!selectedPet && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Mis mascotas</h2>
              <p className="text-sm text-slate-500">
                Solo se muestran animales vinculados a {currentUser.name}.
              </p>
            </div>
            <Badge variant="success">{ownedPetProfiles.length} registradas</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ownedPetProfiles.map((pet) => (
              <AnimalPassportCard
                key={pet.id}
                pet={pet}
                isSelected={false}
                onClick={() => handleSelectPet(pet)}
              />
            ))}
          </div>
        </section>
      )}

      {selectedPet && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Detalle abierto</p>
            <h2 className="text-lg font-bold text-slate-800">{visiblePet?.name}</h2>
          </div>
          <button
            type="button"
            onClick={handleBackToCards}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            <Icon name="passport" size={16} />
            Volver a mis mascotas
          </button>
        </div>
      )}

      {visiblePet && passportInfo ? (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="relative h-48 overflow-hidden bg-gradient-to-r from-emerald-400 via-sky-400 to-slate-800">
            {visiblePet.photoUrl && (
              <img
                src={visiblePet.photoUrl}
                alt={visiblePet.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="rounded-3xl bg-white p-2 shadow-xl">
                  {visiblePet.photoUrl ? (
                    <img
                      src={visiblePet.photoUrl}
                      alt={visiblePet.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                  ) : (
                    <Avatar icon={selectedPet.icon} size="xl" color={selectedPet.color} />
                  )}
                </div>
                <div className="pb-2 text-white">
                  <h2 className="text-3xl font-black leading-tight">{visiblePet.name}</h2>
                  <p className="text-sm font-semibold text-white/85">{visiblePet.breed}</p>
                </div>
              </div>
              <Badge variant={passportInfo.status === "Verificado" ? "success" : "warning"}>
                {passportInfo.status}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <FormField label="Foto de la mascota">
                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 transition-colors hover:bg-emerald-50">
                      {form.photoUrl ? (
                        <img
                          src={form.photoUrl}
                          alt={form.name}
                          className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                        />
                      ) : (
                        <span className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                          <Icon name="camera" size={30} />
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold text-slate-800">Subir foto y generar modelo</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          La vista 3D se actualiza con una simulacion IA lista para conectar a Fal.
                        </span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePetPhotoSelect}
                      />
                    </label>
                  </FormField>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Nombre" required>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`${inputClass} font-bold`}
                        required
                      />
                    </FormField>
                    <FormField label="Raza" required>
                      <select
                        value={form.breed}
                        onChange={(e) => setForm({ ...form, breed: e.target.value })}
                        className={inputClass}
                        required
                      >
                        {breeds.map((b) => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Biografia" required>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      className={textareaClass}
                      required
                    />
                  </FormField>

                  {form.modelProfile && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
                      <div className="flex items-center gap-2 font-bold">
                        <Icon name="spark" size={18} />
                        Modelo IA preparado
                      </div>
                      <p className="mt-1">
                        Perfil detectado: {form.modelProfile.species}. Confianza visual: {Math.round(form.modelProfile.confidence * 100)}%.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{visiblePet.species}</Badge>
                    <Badge>{visiblePet.age}</Badge>
                    <Badge>{passportInfo.code}</Badge>
                  </div>
                  <p className="text-slate-600 mt-4 leading-relaxed">{visiblePet.bio}</p>
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <h3 className="font-bold text-slate-800">Ficha completa del animal</h3>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-slate-400">Nombre</dt>
                        <dd className="font-semibold text-slate-800">{visiblePet.name}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Especie</dt>
                        <dd className="font-semibold text-slate-800">{visiblePet.species}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Raza</dt>
                        <dd className="font-semibold text-slate-800">{visiblePet.breed}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Edad</dt>
                        <dd className="font-semibold text-slate-800">{visiblePet.age}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Dueño</dt>
                        <dd className="font-semibold text-slate-800">{visiblePet.owner}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Pasaporte</dt>
                        <dd className="font-semibold text-slate-800">{passportInfo.code}</dd>
                      </div>
                    </dl>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{visiblePet.posts}</p>
                <p className="text-xs text-slate-400">Publicaciones</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-slate-800">{visiblePet.followers}</p>
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
          <PetModelStage pet={visiblePet} />

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

          <Link
            to="/profile"
            className="group block bg-white rounded-2xl shadow-sm border border-slate-100 p-5 transition-all hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon name="user" size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-800">Dueño</h3>
                  <p className="text-sm text-slate-600">{visiblePet.owner}</p>
                </div>
              </div>
              <Icon name="user" size={18} className="text-slate-300 transition-colors group-hover:text-emerald-500" />
            </div>
            <p className="mt-3 text-xs font-semibold text-emerald-600">
              Ver perfil del dueño
            </p>
          </Link>

          <DigitalPassportCard
            passport={passportInfo}
            isEditing={isEditing}
            onChange={setForm}
          />
        </div>
      </div>
      ) : null}
    </div>
  );
}
