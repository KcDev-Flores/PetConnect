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
  };
}
