import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { breeds } from "../data/mockData";
import { useAuthStore } from "../store/authStore";
import { usePets } from "../hooks/usePets";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";
import { FormField, inputClass, textareaClass } from "../components/ui/FormPrimitives";
import { loadDeletedOwnedPetIds, loadOwnedPets, saveOwnedPets } from "../data/localPets";

const LOCAL_ALERTS_KEY = "petconnect:lost-alert-posts";

function createPassportInfo(pet) {
  return {
    code: `PC-${String(pet.id).padStart(6, "0")}`,
    microchip: `SV-2026-${String(4300 + pet.id)}`,
    issuedAt: "Julio 2026",
    status: "Verificado",
  };
}

function readLocalEmergencyAlerts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ALERTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function getLostPetIds() {
  return readLocalEmergencyAlerts().map((alert) => alert.petId);
}

function saveLocalEmergencyAlerts(alerts) {
  try {
    localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(alerts));
  } catch {
    const lightweightAlerts = alerts.map((alert, index) => (index === 0 ? alert : { ...alert, photoUrl: "" }));
    localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(lightweightAlerts));
  }
}

function optimizeAlertPhoto(photoUrl) {
  if (!photoUrl) return Promise.resolve("");

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const maxSize = 720;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.76));
    };
    image.onerror = () => resolve(photoUrl);
    image.src = photoUrl;
  });
}

function createLostAlertFromPet(pet, values, photoUrl) {
  const passport = pet.passport ?? createPassportInfo(pet);
  const id = Date.now();

  return {
    id,
    petId: pet.id,
    petName: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    bio: pet.bio,
    owner: pet.owner,
    icon: pet.icon,
    color: pet.color,
    photoUrl: photoUrl ?? pet.photoUrl ?? "",
    status: "Perdido",
    passport,
    lostLocation: values.lostLocation.trim(),
    lostDate: values.lostDate.trim() || "Hoy",
    contactPhone: values.contactPhone.trim(),
    reward: values.reward.trim(),
    notes: values.notes.trim() || pet.bio,
    createdAtLabel: "Publicado desde pasaporte",
    sightings: [],
  };
}

function createVeterinaryInfo(pet) {
  return pet.veterinaryInfo ?? {
    clinic: "Clinica veterinaria pendiente",
    veterinarian: "Veterinario pendiente",
    license: "JVPM-0000",
    phone: "+503 7000-0000",
    email: "veterinaria@petconnect.sv",
    address: "San Salvador, El Salvador",
    lastCheckup: "Julio 2026",
    nextCheckup: "Enero 2027",
    notes: "Sin observaciones medicas criticas registradas.",
  };
}

function createTravelInfo(pet) {
  return pet.travelInfo ?? {
    destination: "Pais destino por definir",
    rabiesVaccine: "Vigente",
    healthCertificate: "Pendiente de emision",
    exportPermit: "Pendiente",
    parasiteTreatment: "Pendiente 24-48h antes del viaje",
    microchipStandard: "ISO 11784/11785",
    airlineCrate: "Transportadora IATA pendiente de validar",
    notes: "Validar requisitos especificos con la embajada, aerolinea y autoridad sanitaria del pais destino.",
  };
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

function InfoLine({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="max-w-[62%] text-right font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function VeterinaryInfoCard({ veterinaryInfo, isEditing, onChange }) {
  const setVeterinaryField = (field) => (e) => {
    onChange((current) => ({
      ...current,
      veterinaryInfo: {
        ...current.veterinaryInfo,
        [field]: e.target.value,
      },
    }));
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-600">
          <Icon name="activity" size={22} />
        </div>
        <div>
          <h3 className="font-black text-slate-900">Veterinario y salud</h3>
          <p className="text-xs font-semibold text-slate-400">Contacto medico, controles y observaciones</p>
        </div>
      </div>

      {isEditing ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Clinica">
            <input value={veterinaryInfo.clinic} onChange={setVeterinaryField("clinic")} className={inputClass} />
          </FormField>
          <FormField label="Veterinario">
            <input value={veterinaryInfo.veterinarian} onChange={setVeterinaryField("veterinarian")} className={inputClass} />
          </FormField>
          <FormField label="Registro profesional">
            <input value={veterinaryInfo.license} onChange={setVeterinaryField("license")} className={inputClass} />
          </FormField>
          <FormField label="Telefono">
            <input value={veterinaryInfo.phone} onChange={setVeterinaryField("phone")} className={inputClass} />
          </FormField>
          <FormField label="Correo">
            <input value={veterinaryInfo.email} onChange={setVeterinaryField("email")} className={inputClass} />
          </FormField>
          <FormField label="Direccion">
            <input value={veterinaryInfo.address} onChange={setVeterinaryField("address")} className={inputClass} />
          </FormField>
          <FormField label="Ultimo chequeo">
            <input value={veterinaryInfo.lastCheckup} onChange={setVeterinaryField("lastCheckup")} className={inputClass} />
          </FormField>
          <FormField label="Proximo chequeo">
            <input value={veterinaryInfo.nextCheckup} onChange={setVeterinaryField("nextCheckup")} className={inputClass} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Notas medicas">
              <textarea value={veterinaryInfo.notes} onChange={setVeterinaryField("notes")} rows={3} className={textareaClass} />
            </FormField>
          </div>
        </div>
      ) : (
        <>
          <dl className="space-y-3 text-sm">
            <InfoLine label="Clinica" value={veterinaryInfo.clinic} />
            <InfoLine label="Veterinario" value={veterinaryInfo.veterinarian} />
            <InfoLine label="Registro" value={veterinaryInfo.license} />
            <InfoLine label="Telefono" value={veterinaryInfo.phone} />
            <InfoLine label="Correo" value={veterinaryInfo.email} />
            <InfoLine label="Direccion" value={veterinaryInfo.address} />
          </dl>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Ultimo chequeo</p>
              <p className="mt-1 font-black text-slate-800">{veterinaryInfo.lastCheckup}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Proximo chequeo</p>
              <p className="mt-1 font-black text-emerald-800">{veterinaryInfo.nextCheckup}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-relaxed text-sky-900">
            {veterinaryInfo.notes}
          </div>
        </>
      )}
    </section>
  );
}

function TravelDocumentsCard({ travelInfo, passport, isEditing, onChange }) {
  const setTravelField = (field) => (e) => {
    onChange((current) => ({
      ...current,
      travelInfo: {
        ...current.travelInfo,
        [field]: e.target.value,
      },
    }));
  };

  const documents = [
    {
      title: "Pasaporte digital o cartilla sanitaria",
      detail: `ID ${passport.code} con datos del animal y del dueno.`,
      status: passport.status,
    },
    {
      title: "Microchip compatible",
      detail: `${passport.microchip} registrado bajo estandar ${travelInfo.microchipStandard}.`,
      status: passport.microchip ? "Listo" : "Pendiente",
    },
    {
      title: "Vacuna contra la rabia",
      detail: "Debe estar vigente y dentro del periodo aceptado por el pais destino.",
      status: travelInfo.rabiesVaccine,
    },
    {
      title: "Certificado internacional de salud",
      detail: "Emitido por veterinario autorizado antes del viaje.",
      status: travelInfo.healthCertificate,
    },
    {
      title: "Permiso sanitario de exportacion",
      detail: "Documento solicitado por la autoridad sanitaria del pais de salida.",
      status: travelInfo.exportPermit,
    },
    {
      title: "Desparasitacion y tratamientos",
      detail: "Algunos paises la exigen 24-48 horas antes del vuelo.",
      status: travelInfo.parasiteTreatment,
    },
    {
      title: "Requisitos de aerolinea",
      detail: travelInfo.airlineCrate,
      status: "Revisar",
    },
  ];

  return (
    <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <Icon name="passport" size={22} />
        </div>
        <div>
          <h3 className="font-black text-slate-900">Viaje internacional</h3>
          <p className="text-xs font-semibold text-slate-500">Documentacion recomendada para viajar a otro pais</p>
        </div>
      </div>

      {isEditing ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Pais destino">
            <input value={travelInfo.destination} onChange={setTravelField("destination")} className={inputClass} />
          </FormField>
          <FormField label="Vacuna rabia">
            <input value={travelInfo.rabiesVaccine} onChange={setTravelField("rabiesVaccine")} className={inputClass} />
          </FormField>
          <FormField label="Certificado de salud">
            <input value={travelInfo.healthCertificate} onChange={setTravelField("healthCertificate")} className={inputClass} />
          </FormField>
          <FormField label="Permiso de exportacion">
            <input value={travelInfo.exportPermit} onChange={setTravelField("exportPermit")} className={inputClass} />
          </FormField>
          <FormField label="Desparasitacion">
            <input value={travelInfo.parasiteTreatment} onChange={setTravelField("parasiteTreatment")} className={inputClass} />
          </FormField>
          <FormField label="Estandar microchip">
            <input value={travelInfo.microchipStandard} onChange={setTravelField("microchipStandard")} className={inputClass} />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Requisitos de aerolinea">
              <input value={travelInfo.airlineCrate} onChange={setTravelField("airlineCrate")} className={inputClass} />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField label="Notas de viaje">
              <textarea value={travelInfo.notes} onChange={setTravelField("notes")} rows={3} className={textareaClass} />
            </FormField>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-2xl bg-white/80 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">Destino</p>
            <p className="mt-1 text-lg font-black text-slate-900">{travelInfo.destination}</p>
          </div>

          <div className="grid gap-3">
            {documents.map((document) => (
              <div key={document.title} className="rounded-2xl border border-white bg-white/85 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{document.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{document.detail}</p>
                  </div>
                  <Badge variant={document.status === "Listo" || document.status === "Verificado" || document.status === "Vigente" ? "success" : "warning"}>
                    {document.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
            {travelInfo.notes}
          </div>
        </>
      )}
    </section>
  );
}

function AnimalPassportCard({ pet, isSelected, isLost, onClick }) {
  const passport = pet.passport ?? createPassportInfo(pet);
  const frameClass = isLost ? "border-red-400 ring-red-200" : "border-emerald-400 ring-emerald-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isSelected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-100"
        }`}
    >
      <div className="relative h-28 bg-gradient-to-r from-emerald-300 via-sky-300 to-slate-700">
        {pet.photoUrl && (
          <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <div className={`rounded-2xl border-2 bg-white p-1.5 shadow-lg ring-2 ${frameClass}`}>
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
          {isLost && <Badge variant="danger">Perdido</Badge>}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { pets: apiPets } = usePets();
  
  const [localOwnedPets, setLocalOwnedPets] = useState(() => loadOwnedPets());
  const [deletedPetIds] = useState(() => loadDeletedOwnedPetIds());
  const visibleBasePets = apiPets.filter((pet) => !deletedPetIds.some((id) => String(id) === String(pet.id)));
  const loggedBasePetIds = visibleBasePets.map(p => p.id);
  const allPets = [...visibleBasePets, ...localOwnedPets];
  const loggedPetIds = [...loggedBasePetIds, ...localOwnedPets.map((pet) => pet.id)];
  const requestedPet = allPets.find((pet) =>
    String(pet.id) === searchParams.get("pet") && loggedPetIds.includes(pet.id)
  );
  const initialPetId = requestedPet?.id ?? null;
  const [petProfiles, setPetProfiles] = useState(() =>
    allPets.map((pet) => ({
      ...pet,
      photoUrl: pet.photoUrl || "",
      passport: pet.passport ?? createPassportInfo(pet),
      veterinaryInfo: createVeterinaryInfo(pet),
      travelInfo: createTravelInfo(pet),
    }))
  );
  const [selectedPetId, setSelectedPetId] = useState(initialPetId);
  const [isEditing, setIsEditing] = useState(false);
  const [showLostForm, setShowLostForm] = useState(false);
  const [lostDraft, setLostDraft] = useState({
    lostLocation: "",
    lostDate: "",
    contactPhone: user?.user_metadata?.phone || "",
    reward: "",
    notes: "",
  });
  const [lostPetIds, setLostPetIds] = useState(() => getLostPetIds());
  const [lostAlertCreated, setLostAlertCreated] = useState(false);
  const ownedPetProfiles = petProfiles.filter((pet) => loggedPetIds.includes(pet.id));
  const selectedPet = ownedPetProfiles.find((pet) => pet.id === selectedPetId) ?? null;
  const [form, setForm] = useState(selectedPet ? { ...selectedPet } : null);
  const canEditSelectedPet = Boolean(selectedPet && loggedPetIds.includes(selectedPet.id));

  const handleSave = () => {
    if (!canEditSelectedPet || !form) return;

    const passport = form.passport ?? createPassportInfo(form);
    const veterinaryInfo = form.veterinaryInfo ?? createVeterinaryInfo(form);
    const travelInfo = form.travelInfo ?? createTravelInfo(form);
    const updatedPet = { ...selectedPet, ...form, passport, veterinaryInfo, travelInfo };

    setPetProfiles((current) =>
      current.map((pet) =>
        pet.id === selectedPetId ? updatedPet : pet
      )
    );
    if (localOwnedPets.some((pet) => pet.id === selectedPetId)) {
      const nextLocalOwnedPets = localOwnedPets.map((pet) =>
        pet.id === selectedPetId ? updatedPet : pet
      );
      setLocalOwnedPets(nextLocalOwnedPets);
      saveOwnedPets(nextLocalOwnedPets);
    }
    setForm((current) => (current ? { ...current, passport, veterinaryInfo, travelInfo } : current));
    setIsEditing(false);
  };

  const handleSelectPet = (pet) => {
    if (!loggedPetIds.includes(pet.id)) return;

    setSelectedPetId(pet.id);
    setForm({ ...pet });
    setIsEditing(false);
    setShowLostForm(false);
    setLostAlertCreated(false);
    setSearchParams({ pet: String(pet.id) });
  };

  const handleBackToCards = () => {
    setSelectedPetId(null);
    setForm(null);
    setIsEditing(false);
    setShowLostForm(false);
    setLostAlertCreated(false);
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
      };
    });
  };

  const setLostField = (field) => (e) => {
    setLostDraft((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleDeclareLost = async (e) => {
    e.preventDefault();
    if (!visiblePet || !lostDraft.lostLocation.trim()) return;

    const alertPhoto = await optimizeAlertPhoto(visiblePet.photoUrl);
    const alert = createLostAlertFromPet(visiblePet, lostDraft, alertPhoto);
    const nextAlerts = [alert, ...readLocalEmergencyAlerts()];

    try {
      saveLocalEmergencyAlerts(nextAlerts);
    } catch {
      saveLocalEmergencyAlerts([{ ...alert, photoUrl: "" }]);
    }
    setLostDraft({
      lostLocation: "",
      lostDate: "",
      contactPhone: user?.user_metadata?.phone || "",
      reward: "",
      notes: "",
    });
    setLostPetIds((current) =>
      current.some((id) => String(id) === String(visiblePet.id))
        ? current
        : [...current, visiblePet.id]
    );
    setLostAlertCreated(true);
    setShowLostForm(false);
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
  const veterinaryInfo = visiblePet ? visiblePet.veterinaryInfo ?? createVeterinaryInfo(visiblePet) : null;
  const travelInfo = visiblePet ? visiblePet.travelInfo ?? createTravelInfo(visiblePet) : null;
  const visiblePetIsLost = Boolean(visiblePet && lostPetIds.some((id) => String(id) === String(visiblePet.id)));
  const photoFrameClass = visiblePetIsLost
    ? "border-red-400 ring-red-200"
    : "border-emerald-400 ring-emerald-200";

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
                Solo se muestran animales vinculados a {user?.user_metadata?.name || "tu perfil"}.
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
                isLost={lostPetIds.some((id) => String(id) === String(pet.id))}
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
                  <div className={`rounded-3xl border-4 bg-white p-2 shadow-xl ring-4 ${photoFrameClass}`}>
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
                          <span className="block text-sm font-bold text-slate-800">Subir foto de la mascota</span>
                          <span className="mt-1 block text-xs text-slate-500">
                            Esta imagen se usara en el pasaporte y en la tarjeta del animal.
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

                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="info">{visiblePet.species}</Badge>
                      <Badge>{visiblePet.age}</Badge>
                      {visiblePetIsLost && <Badge variant="danger">Perdido</Badge>}
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

            <section className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-red-500">
                  <Icon name="alert" size={22} />
                </div>
                <div>
                  <h3 className="font-black text-red-900">Declarar mascota perdida</h3>
                  <p className="mt-1 text-sm leading-relaxed text-red-700">
                    Crea una publicacion en Emergencia usando este pasaporte.
                  </p>
                </div>
              </div>

              {lostAlertCreated && (
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-3 text-sm font-semibold text-emerald-700">
                  Alerta publicada en Emergencia.
                  <Link to="/emergency" className="ml-2 font-black text-emerald-800 hover:text-emerald-900">
                    Ver publicacion
                  </Link>
                </div>
              )}

              {!showLostForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowLostForm(true);
                    setLostAlertCreated(false);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-red-600"
                >
                  <Icon name="alert" size={17} />
                  Marcar como perdido
                </button>
              ) : (
                <form onSubmit={handleDeclareLost} className="mt-4 space-y-3">
                  <FormField label="Ubicacion donde se perdio" required>
                    <input
                      value={lostDraft.lostLocation}
                      onChange={setLostField("lostLocation")}
                      className={inputClass}
                      placeholder="Ej: Parque Bicentenario"
                      required
                    />
                  </FormField>
                  <FormField label="Fecha">
                    <input
                      type="date"
                      value={lostDraft.lostDate}
                      onChange={setLostField("lostDate")}
                      className={inputClass}
                    />
                  </FormField>
                  <FormField label="Contacto">
                    <input
                      value={lostDraft.contactPhone}
                      onChange={setLostField("contactPhone")}
                      className={inputClass}
                      placeholder="+503 0000-0000"
                    />
                  </FormField>
                  <FormField label="Recompensa">
                    <input
                      value={lostDraft.reward}
                      onChange={setLostField("reward")}
                      className={inputClass}
                      placeholder="Opcional"
                    />
                  </FormField>
                  <FormField label="Descripcion">
                    <textarea
                      value={lostDraft.notes}
                      onChange={setLostField("notes")}
                      className={textareaClass}
                      rows={3}
                      placeholder="Senas, collar, comportamiento o indicaciones importantes."
                    />
                  </FormField>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLostForm(false)}
                      className="flex-1 rounded-2xl border border-red-200 bg-white px-4 py-2.5 text-sm font-black text-red-600 transition-colors hover:bg-red-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-red-600"
                    >
                      Publicar
                    </button>
                  </div>
                </form>
              )}
            </section>

            <DigitalPassportCard
              passport={passportInfo}
              isEditing={isEditing}
              onChange={setForm}
            />

            {veterinaryInfo && (
              <VeterinaryInfoCard
                veterinaryInfo={veterinaryInfo}
                isEditing={isEditing}
                onChange={setForm}
              />
            )}

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
          </div>

          {travelInfo && (
            <div className="lg:col-span-3">
              <TravelDocumentsCard
                travelInfo={travelInfo}
                passport={passportInfo}
                isEditing={isEditing}
                onChange={setForm}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
