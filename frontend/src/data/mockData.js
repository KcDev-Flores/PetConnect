export const breeds = [
  { id: 1, name: "Golden Retriever", species: "Perro", size: "Grande", origin: "Reino Unido" },
  { id: 2, name: "Siamés", species: "Gato", size: "Mediano", origin: "Tailandia" },
  { id: 3, name: "Labrador", species: "Perro", size: "Grande", origin: "Canadá" },
  { id: 4, name: "Persa", species: "Gato", size: "Mediano", origin: "Irán" },
  { id: 5, name: "Bulldog Francés", species: "Perro", size: "Pequeño", origin: "Francia" },
  { id: 6, name: "Maine Coon", species: "Gato", size: "Grande", origin: "Estados Unidos" },
  { id: 7, name: "Beagle", species: "Perro", size: "Mediano", origin: "Reino Unido" },
  { id: 8, name: "Husky Siberiano", species: "Perro", size: "Grande", origin: "Rusia" },
];

export const pets = [
  {
    id: 1,
    name: "Max",
    breed: "Golden Retriever",
    species: "Perro",
    age: "3 años",
    bio: "Le encanta nadar y perseguir pelotas. Muy sociable con niños.",
    owner: "María González",
    icon: "dog",
    color: "#F59E0B",
    followers: 128,
    posts: 24,
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamés",
    species: "Gato",
    age: "2 años",
    bio: "Curiosa y vocal. Duerme al sol todo el día.",
    owner: "Carlos Ruiz",
    icon: "cat",
    color: "#8B5CF6",
    followers: 89,
    posts: 15,
  },
  {
    id: 3,
    name: "Rocky",
    breed: "Bulldog Francés",
    species: "Perro",
    age: "4 años",
    bio: "Pequeño pero con mucha personalidad. Ronca cuando duerme.",
    owner: "Ana Martínez",
    icon: "dog",
    color: "#EC4899",
    followers: 203,
    posts: 31,
  },
];

export const posts = [
  {
    id: 1,
    petId: 1,
    petName: "Max",
    icon: "dog",
    content: "Primer día en la playa. Max no quería salir del agua.",
    image: null,
    likes: 42,
    comments: 8,
    time: "Hace 2 horas",
  },
  {
    id: 2,
    petId: 2,
    petName: "Luna",
    icon: "cat",
    content: "Luna descubrió su nuevo rascador y ya es la reina del salón.",
    image: null,
    likes: 67,
    comments: 12,
    time: "Hace 5 horas",
  },
  {
    id: 3,
    petId: 3,
    petName: "Rocky",
    icon: "dog",
    content: "Paseo matutino por el parque. Rocky saludó a todos los perros del barrio.",
    image: null,
    likes: 31,
    comments: 5,
    time: "Ayer",
  },
  {
    id: 4,
    petId: 1,
    petName: "Max",
    icon: "dog",
    content: "¿Alguien conoce un buen veterinario cerca de Santa Tecla? Necesitamos chequeo anual.",
    image: null,
    likes: 18,
    comments: 14,
    time: "Ayer",
  },
];

export const lostReports = [
  {
    id: 1,
    petName: "Toby",
    breed: "Beagle",
    species: "Perro",
    icon: "dog",
    description: "Beagle tricolor, collar rojo con placa 'Toby'. Asustadizo pero no agresivo.",
    lastSeen: "Colonia Escalón, San Salvador",
    lastSeenDate: "3 Jul 2026",
    reward: "$50",
    status: "activo",
    owner: "Pedro Hernández",
    phone: "+503 7123-4567",
    sightings: [
      { id: 1, lat: 35, lng: 45, comment: "Lo vi cruzando la calle cerca del parque", author: "Lucía M.", time: "Hace 3h", confidence: 0.9 },
      { id: 2, lat: 55, lng: 38, comment: "Escuché ladridos en esa zona anoche", author: "Jorge P.", time: "Hace 8h", confidence: 0.6 },
      { id: 3, lat: 42, lng: 62, comment: "Vi un beagle similar en la panadería", author: "Sofía R.", time: "Hace 1d", confidence: 0.75 },
    ],
  },
  {
    id: 2,
    petName: "Michi",
    breed: "Persa",
    species: "Gato",
    icon: "cat",
    description: "Gato persa blanco, ojos azules. Sin collar. Muy peludo.",
    lastSeen: "Antiguo Cuscatlán",
    lastSeenDate: "2 Jul 2026",
    reward: null,
    status: "activo",
    owner: "Laura Vega",
    phone: "+503 7890-1234",
    sightings: [
      { id: 1, lat: 30, lng: 70, comment: "Gato blanco en el techo de una casa", author: "Diego S.", time: "Hace 6h", confidence: 0.85 },
    ],
  },
];

export const currentUser = {
  name: "María González",
  email: "maria@email.com",
  icon: "user",
  location: "San Salvador, El Salvador",
  joined: "Marzo 2026",
  pets: [1],
};

export function estimateLocation(sightings) {
  if (!sightings?.length) return null;

  let sumLat = 0;
  let sumLng = 0;
  let sumWeight = 0;

  for (const s of sightings) {
    const ageHours = s.ageHours ?? 12;
    const weight = Math.exp(-ageHours / 24) * (s.confidence || 1);
    sumLat += s.lat * weight;
    sumLng += s.lng * weight;
    sumWeight += weight;
  }

  const lat = sumLat / sumWeight;
  const lng = sumLng / sumWeight;

  const distances = sightings.map((s) =>
    Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2)
  );
  const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;

  return { lat, lng, radius: Math.max(8, avgDist * 1.5) };
}
