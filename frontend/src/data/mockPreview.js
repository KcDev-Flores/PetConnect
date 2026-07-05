/**
 * Datos estáticos SOLO para previsualizar la UI (P1).
 * P2 conectará Zustand + webhooks n8n y reemplazará estos props.
 */
export { breeds, pets, posts, lostReports, currentUser } from "./mockData";

export const previewActivePet = {
  name: "Max",
  icon: "dog",
  color: "#F59E0B",
};

export const previewEstimatedZone = {
  lat: 44,
  lng: 48,
  radius: 14,
};

export const emptyAlertForm = {
  petName: "",
  species: "Perro",
  breed: "",
  description: "",
  lastSeen: "",
  lastSeenDate: "",
  phone: "",
  reward: "",
  photoPreview: null,
};

export const emptySightingForm = {
  location: "",
  comment: "",
};

export const previewMatchResult = {
  found: true,
  petName: "Toby",
  breed: "Beagle",
  owner: "Pedro Hernández",
  phone: "+503 7123-4567",
  confidence: 92,
};
