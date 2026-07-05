const OWNED_PETS_KEY = "petconnect:owned-pets";

export function loadOwnedPets() {
  try {
    const raw = window.localStorage.getItem(OWNED_PETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOwnedPets(pets) {
  window.localStorage.setItem(OWNED_PETS_KEY, JSON.stringify(pets));
}

function clean(value) {
  return value?.trim() ?? "";
}

export function createOwnedPet(values, owner) {
  const species = values.species || "Perro";
  const id = Date.now();

  return {
    id,
    name: values.name.trim(),
    breed: values.breed.trim(),
    species,
    age: values.age.trim(),
    bio: values.bio.trim(),
    owner,
    icon: species === "Gato" ? "cat" : "dog",
    color: species === "Gato" ? "#38BDF8" : "#10B981",
    followers: 0,
    posts: 0,
    photoUrl: values.photoUrl || "",
    passport: {
      code: values.passportCode.trim() || `PC-${String(id).slice(-6)}`,
      microchip: values.microchip.trim() || `SV-2026-${String(id).slice(-4)}`,
      issuedAt: values.issuedAt.trim() || "Julio 2026",
      status: values.passportStatus || "Verificado",
    },
    veterinaryInfo: {
      clinic: clean(values.clinic) || "Clinica veterinaria pendiente",
      veterinarian: clean(values.veterinarian) || "Veterinario pendiente",
      license: clean(values.license) || "JVPM-0000",
      phone: clean(values.vetPhone) || "+503 7000-0000",
      email: clean(values.vetEmail) || "veterinaria@petconnect.sv",
      address: clean(values.vetAddress) || "San Salvador, El Salvador",
      lastCheckup: clean(values.lastCheckup) || "Julio 2026",
      nextCheckup: clean(values.nextCheckup) || "Enero 2027",
      notes: clean(values.medicalNotes) || "Sin observaciones medicas criticas registradas.",
    },
    travelInfo: {
      destination: clean(values.travelDestination) || "Pais destino por definir",
      rabiesVaccine: clean(values.rabiesVaccine) || "Vigente",
      healthCertificate: clean(values.healthCertificate) || "Pendiente de emision",
      exportPermit: clean(values.exportPermit) || "Pendiente",
      parasiteTreatment: clean(values.parasiteTreatment) || "Pendiente 24-48h antes del viaje",
      microchipStandard: clean(values.microchipStandard) || "ISO 11784/11785",
      airlineCrate: clean(values.airlineCrate) || "Transportadora IATA pendiente de validar",
      notes: clean(values.travelNotes) || "Validar requisitos especificos con la embajada, aerolinea y autoridad sanitaria del pais destino.",
    },
  };
}
