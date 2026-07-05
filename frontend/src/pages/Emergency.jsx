import { useMemo, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { usePets } from "../hooks/usePets";
import { loadDeletedOwnedPetIds, loadOwnedPets } from "../data/localPets";
import { useLostPets } from "../hooks/useLostPets";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";
import { FormField, inputClass, textareaClass } from "../components/ui/FormPrimitives";

const LOCAL_ALERTS_KEY = "petconnect:lost-alert-posts";

function createPassportInfo(pet) {
  return pet.passport ?? {
    code: `PC-${String(pet.id).padStart(6, "0")}`,
    microchip: `SV-2026-${String(4300 + pet.id)}`,
    issuedAt: "Julio 2026",
    status: "Verificado",
  };
}

function readLocalAlerts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ALERTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveLocalAlerts(alerts) {
  try {
    localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(alerts));
  } catch {
    const lightweightAlerts = alerts.map((alert, index) => (index === 0 ? alert : { ...alert, photoUrl: "" }));
    localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(lightweightAlerts));
  }
}

function hydrateAlertPhoto(alert, sourcePets) {
  if (alert.photoUrl) return alert;

  const sourcePet = sourcePets.find((pet) => String(pet.id) === String(alert.petId));
  if (!sourcePet?.photoUrl) return alert;

  return {
    ...alert,
    photoUrl: sourcePet.photoUrl,
  };
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

function createWhatsAppLink(phone, petName, location) {
  const cleanPhone = phone?.replace(/[^\d]/g, "") ?? "";
  if (!cleanPhone) return "";

  const message = `Hola, vi la alerta de ${petName} en PetConnect. Tengo informacion sobre la mascota perdida cerca de ${location}.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function normalizeReport(report) {
  const petId = report.petId ?? report.id;
  const passport = report.passport ?? createPassportInfo({ id: petId });

  return {
    id: report.id,
    petId,
    petName: report.petName,
    species: report.species,
    breed: report.breed,
    age: report.age ?? "Edad por confirmar",
    bio: report.description,
    owner: report.owner ?? "Dueno por confirmar",
    icon: report.icon ?? (report.species === "Gato" ? "cat" : "dog"),
    color: report.color ?? "#EF4444",
    photoUrl: report.photoUrl ?? "",
    status: "Perdido",
    passport,
    lostLocation: report.lostLocation ?? report.lastSeen,
    lostDate: report.lostDate ?? report.lastSeenDate ?? "Hoy",
    contactPhone: report.contactPhone ?? report.phone,
    reward: report.reward ?? "",
    notes: report.notes ?? report.description,
    createdAtLabel: report.createdAtLabel ?? report.time ?? "Alerta activa",
    sightings: report.sightings ?? [],
  };
}

function createAlertFromDraft(draft, selectedPet, photoUrl) {
  const passport = createPassportInfo(selectedPet);
  const id = Date.now();

  return {
    id,
    petId: selectedPet.id,
    petName: selectedPet.name,
    species: selectedPet.species,
    breed: selectedPet.breed,
    age: selectedPet.age,
    bio: selectedPet.bio,
    owner: selectedPet.owner,
    icon: selectedPet.icon,
    color: selectedPet.color,
    photoUrl: photoUrl ?? selectedPet.photoUrl ?? "",
    status: "Perdido",
    passport,
    lostLocation: draft.lostLocation.trim(),
    lostDate: draft.lostDate.trim() || "Hoy",
    contactPhone: draft.contactPhone.trim(),
    reward: draft.reward.trim(),
    notes: draft.notes.trim() || selectedPet.bio,
    createdAtLabel: "Publicado ahora",
    sightings: [],
  };
}

function EmergencyAlertCard({ alert, isSelected, onClick, canResolve, onMarkFound }) {
  const handleMarkFound = (e) => {
    e.stopPropagation();
    onMarkFound(alert.id);
  };

  return (
    <article
      className={`overflow-hidden rounded-[2rem] border bg-white shadow-sm transition-all ${
        isSelected ? "border-red-300 ring-2 ring-red-100" : "border-slate-100 hover:border-red-200"
      }`}
    >
      <button type="button" onClick={onClick} className="block w-full text-left">
        <div className="relative h-44 bg-gradient-to-r from-red-400 via-amber-300 to-slate-800">
          {alert.photoUrl && <img src={alert.photoUrl} alt={alert.petName} className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge variant="danger">Perdido</Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
            <div className="rounded-2xl bg-white p-1.5 shadow-xl">
              {alert.photoUrl ? (
                <img src={alert.photoUrl} alt={alert.petName} className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <Avatar icon={alert.icon} size="md" color={alert.color} />
              )}
            </div>
            <div className="min-w-0 text-white">
              <h3 className="truncate text-2xl font-black leading-tight">{alert.petName}</h3>
              <p className="truncate text-sm font-semibold text-white/85">{alert.breed} · {alert.species}</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{alert.notes}</p>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 font-bold text-red-700">
              <Icon name="pin" size={17} />
              <span className="truncate">{alert.lostLocation}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Pasaporte</span>
              <span className="text-sm font-black text-slate-800">{alert.passport.code}</span>
            </div>
          </div>
        </div>
      </button>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition-colors hover:bg-red-600"
        >
          <Icon name="passport" size={15} />
          Ver informacion
        </button>
        {canResolve && (
          <button
            type="button"
            onClick={handleMarkFound}
            className="flex min-w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white transition-colors hover:bg-emerald-600 sm:min-w-0 sm:flex-1"
          >
            <Icon name="check" size={15} />
            Encontrado
          </button>
        )}
      </div>
    </article>
  );
}

function SelectedAlertDetail({ alert, canResolve, onMarkFound, onBack }) {
  if (!alert) return null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(alert.lostLocation)}`;
  const whatsappUrl = createWhatsAppLink(alert.contactPhone, alert.petName, alert.lostLocation);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-500">Publicacion de emergencia</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900">{alert.petName} esta perdido</h2>
            <p className="mt-1 text-sm text-slate-500">{alert.createdAtLabel}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="danger">{alert.status}</Badge>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
            >
              <Icon name="passport" size={16} />
              Volver a alertas
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="space-y-3">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-red-100 via-amber-50 to-slate-200 p-2 shadow-sm">
            {alert.photoUrl ? (
              <img src={alert.photoUrl} alt={alert.petName} className="aspect-square w-full rounded-2xl object-cover" />
            ) : (
              <div className="grid aspect-square place-items-center rounded-2xl bg-white/70 text-red-500">
                <Icon name={alert.icon || "paw"} size={58} />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Contacto</p>
            <p className="mt-1 text-sm font-black text-slate-900">{alert.contactPhone || "No agregado"}</p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white transition-colors hover:bg-emerald-600"
              >
                <Icon name="phone" size={15} />
                WhatsApp
              </a>
            )}
            {canResolve && (
              <button
                type="button"
                onClick={() => onMarkFound(alert.id)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white transition-colors hover:bg-emerald-600"
              >
                <Icon name="check" size={15} />
                Marcar como encontrado
              </button>
            )}
          </div>
        </aside>

        <div className="space-y-4">
          <div>
            <h3 className="font-black text-slate-900">Informacion del animal</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{alert.notes}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Nombre", alert.petName],
              ["Especie", alert.species],
              ["Raza", alert.breed],
              ["Edad", alert.age],
              ["Dueno", alert.owner],
              ["Contacto", alert.contactPhone || "No agregado"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-3">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</dt>
                <dd className="mt-1 font-black text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <Icon name="passport" size={20} className="text-emerald-700" />
              <h3 className="font-black text-emerald-900">Datos del pasaporte</h3>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-3">
                <dt className="text-emerald-700/70">ID</dt>
                <dd className="font-bold text-emerald-950">{alert.passport.code}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-emerald-700/70">Microchip</dt>
                <dd className="text-right font-bold text-emerald-950">{alert.passport.microchip}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-emerald-700/70">Emision</dt>
                <dd className="font-bold text-emerald-950">{alert.passport.issuedAt}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-emerald-700/70">Estado</dt>
                <dd className="font-bold text-emerald-950">{alert.passport.status}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-red-500">
                <Icon name="pin" size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-red-900">Ultima ubicacion donde se perdio</h3>
                <p className="mt-1 text-sm font-semibold text-red-700">{alert.lostLocation}</p>
                <p className="mt-1 text-xs text-red-600">Fecha: {alert.lostDate}</p>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-red-600"
            >
              <Icon name="map" size={17} />
              Abrir ubicacion en Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Emergency() {
  const { user } = useAuthStore();
  const { pets: apiPets } = usePets();
  const { reports, loading, submitReport } = useLostPets();
  const [localOwnedPets] = useState(() => loadOwnedPets());
  const [deletedPetIds] = useState(() => loadDeletedOwnedPetIds());
  
  const ownedPets = useMemo(
    () => [
      ...apiPets.filter((pet) => !deletedPetIds.some((id) => String(id) === String(pet.id))),
      ...localOwnedPets,
    ],
    [apiPets, deletedPetIds, localOwnedPets]
  );
  const [localAlerts, setLocalAlerts] = useState(() => readLocalAlerts());
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({
    petId: ownedPets[0]?.id ?? "",
    lostLocation: "",
    lostDate: "",
    contactPhone: user?.user_metadata?.phone || "",
    reward: "",
    notes: "",
  });

  const sourcePets = useMemo(
    () => [...apiPets.filter((pet) => !deletedPetIds.some((id) => String(id) === String(pet.id))), ...localOwnedPets],
    [apiPets, deletedPetIds, localOwnedPets]
  );
  const normalizedReports = useMemo(() => reports.map(normalizeReport), [reports]);
  const alertPosts = useMemo(
    () => [...localAlerts, ...normalizedReports].map((alert) => hydrateAlertPhoto(alert, sourcePets)),
    [localAlerts, normalizedReports, sourcePets]
  );
  const selectedAlert = alertPosts.find((alert) => alert.id === selectedAlertId) ?? null;
  const selectedAlertCanResolve = selectedAlert
    ? localAlerts.some((alert) => String(alert.id) === String(selectedAlert.id))
    : false;
  const selectedPet = ownedPets.find((pet) => String(pet.id) === String(draft.petId)) ?? ownedPets[0] ?? null;
  const selectedPetPassport = selectedPet ? createPassportInfo(selectedPet) : null;

  const setDraftField = (field) => (e) => {
    setDraft((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPet || !draft.lostLocation.trim()) return;

    const alertPhoto = await optimizeAlertPhoto(selectedPet.photoUrl);
    const alert = createAlertFromDraft(draft, selectedPet, alertPhoto);
    const nextAlerts = [alert, ...localAlerts];

    setLocalAlerts(nextAlerts);
    saveLocalAlerts(nextAlerts);
    setSelectedAlertId(null);
    setShowComposer(false);
    setDraft({
      petId: ownedPets[0]?.id ?? "",
      lostLocation: "",
      lostDate: "",
      contactPhone: user?.user_metadata?.phone || "",
      reward: "",
      notes: "",
    });

    await submitReport({
      petName: alert.petName,
      breed: alert.breed,
      species: alert.species,
      description: alert.notes,
      lastSeen: alert.lostLocation,
      lastSeenDate: alert.lostDate,
      ownerPhone: alert.contactPhone,
      reward: alert.reward || null,
      passportCode: alert.passport.code,
      microchip: alert.passport.microchip,
    });
  };

  const handleMarkFound = (alertId) => {
    const nextAlerts = localAlerts.filter((alert) => String(alert.id) !== String(alertId));

    setLocalAlerts(nextAlerts);
    saveLocalAlerts(nextAlerts);
    setSelectedAlertId((currentId) => (String(currentId) === String(alertId) ? null : currentId));
    window.dispatchEvent(new Event("petconnect:lost-alerts-updated"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400">Cargando emergencias...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-red-100 bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.20),transparent_32%),linear-gradient(135deg,#fff,#fff7ed_45%,#fef2f2)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Emergencia</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Publica una alerta de mascota perdida.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Usa los datos del pasaporte digital, marca el estado como perdido y comparte la ubicacion donde se perdio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowComposer((current) => !current)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-red-600"
          >
            <Icon name="alert" size={18} />
            {showComposer ? "Cerrar formulario" : "Publicar alerta"}
          </button>
        </div>
      </section>

      {showComposer && (
        <form onSubmit={handleSubmit} className="grid gap-5 rounded-[2rem] border border-red-100 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Nueva publicacion de emergencia</h2>
              <p className="mt-1 text-sm text-slate-500">Selecciona una mascota vinculada a tu perfil.</p>
            </div>

            <FormField label="Mascota del pasaporte" required>
              <select value={draft.petId} onChange={setDraftField("petId")} className={inputClass} required>
                {ownedPets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} · {pet.breed}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Estado">
                <input value="Perdido" readOnly className={`${inputClass} font-black text-red-600`} />
              </FormField>
              <FormField label="Fecha en que se perdio">
                <input
                  type="date"
                  value={draft.lostDate}
                  onChange={setDraftField("lostDate")}
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Ubicacion donde se perdio" required>
              <input
                value={draft.lostLocation}
                onChange={setDraftField("lostLocation")}
                className={inputClass}
                placeholder="Ej: Parque Bicentenario, San Salvador"
                required
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Contacto">
                <input
                  value={draft.contactPhone}
                  onChange={setDraftField("contactPhone")}
                  className={inputClass}
                  placeholder="+503 0000-0000"
                />
              </FormField>
              <FormField label="Recompensa">
                <input
                  value={draft.reward}
                  onChange={setDraftField("reward")}
                  className={inputClass}
                  placeholder="Opcional"
                />
              </FormField>
            </div>

            <FormField label="Descripcion para la publicacion">
              <textarea
                value={draft.notes}
                onChange={setDraftField("notes")}
                className={textareaClass}
                rows={4}
                placeholder="Describe senas, comportamiento, collar, ultimo momento visto o cuidados importantes."
              />
            </FormField>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-red-600"
            >
              <Icon name="alert" size={18} />
              Publicar como perdido
            </button>
          </div>

          <aside className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="flex items-center gap-3">
              {selectedPet?.photoUrl ? (
                <img src={selectedPet.photoUrl} alt={selectedPet.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm" />
              ) : (
                <Avatar icon={selectedPet?.icon ?? "paw"} size="md" color={selectedPet?.color} />
              )}
              <div>
                <h3 className="font-black text-emerald-950">{selectedPet?.name}</h3>
                <p className="text-sm font-semibold text-emerald-700">{selectedPet?.breed}</p>
              </div>
            </div>

            {selectedPetPassport && (
              <div className="mt-5 rounded-2xl bg-white p-4">
                <div className="flex items-center gap-2">
                  <Icon name="passport" size={19} className="text-emerald-700" />
                  <h4 className="font-black text-emerald-950">Pasaporte incluido</h4>
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-700/70">ID</dt>
                    <dd className="font-bold text-emerald-950">{selectedPetPassport.code}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-700/70">Microchip</dt>
                    <dd className="text-right font-bold text-emerald-950">{selectedPetPassport.microchip}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-700/70">Estado</dt>
                    <dd className="font-bold text-emerald-950">{selectedPetPassport.status}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-red-100 bg-white p-4 text-sm leading-relaxed text-slate-600">
              Esta publicacion usara la informacion oficial del pasaporte para que otras personas puedan identificar mejor al animal.
            </div>
          </aside>
        </form>
      )}

      {!selectedAlert ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">Alertas publicadas</h2>
              <p className="text-sm text-slate-500">{alertPosts.length} publicaciones activas</p>
            </div>
            <Badge variant="danger">Perdido</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {alertPosts.map((alert) => (
              <EmergencyAlertCard
                key={alert.id}
                alert={alert}
                isSelected={false}
                onClick={() => setSelectedAlertId(alert.id)}
                canResolve={localAlerts.some((localAlert) => String(localAlert.id) === String(alert.id))}
                onMarkFound={handleMarkFound}
              />
            ))}
          </div>
        </section>
      ) : (
        <SelectedAlertDetail
          alert={selectedAlert}
          canResolve={selectedAlertCanResolve}
          onMarkFound={handleMarkFound}
          onBack={() => setSelectedAlertId(null)}
        />
      )}
    </div>
  );
}
