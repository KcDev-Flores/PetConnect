// ============================================================
// PetConnect — Capa de servicios (API)
// ============================================================
// Todos los fetch al backend de n8n pasan por aquí.
// Mientras VITE_USE_MOCK=true, se usan los datos de mockData.js
// Sin cambiar ningún componente, solo actualiza .env.local:
//   VITE_USE_MOCK=false
//   VITE_N8N_BASE_URL=https://tu-instancia.n8n.io/webhook
// ============================================================

const BASE_URL =
  import.meta.env.VITE_N8N_BASE_URL || "http://localhost:5678/webhook";
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false"; // true por defecto

// ──────────────────────────────────────────
// MASCOTAS PERDIDAS
// ──────────────────────────────────────────

/**
 * Obtiene todos los reportes activos de mascotas perdidas.
 * GET  /webhook/get-lost-pets
 * Response: LostReport[]
 */
export async function getLostPets() {
  if (USE_MOCK) {
    const { lostReports } = await import("../data/mockData.js");
    return lostReports;
  }
  const res = await fetch(`${BASE_URL}/get-lost-pets`);
  if (!res.ok) throw new Error("Error al obtener reportes");
  const data = await res.json();
  const rawData = data.data || data.items || data;
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  return dataArray.map(report => ({
    id: report.id,
    petId: report.pet_id || report.petId,
    petName: report.pet_name || report.petName,
    species: report.species,
    breed: report.breed,
    description: report.description,
    lastSeen: report.last_seen || report.lastSeen,
    lastSeenDate: report.last_seen_date || report.lastSeenDate,
    ownerPhone: report.owner_phone || report.ownerPhone || report.contactPhone,
    reward: report.reward,
    photoUrl: report.photo_url || report.photoUrl,
    status: report.status || "Perdido",
    time: report.time || report.created_at,
  }));
}

/**
 * Crea un nuevo reporte de mascota perdida.
 * POST /webhook/report-lost-pet
 * Body: { petName, breed, species, description, lastSeen, ownerPhone, photoUrl, reward? }
 * Response: { status: "ok", reportId: string }
 */
export async function reportLostPet(data) {
  if (USE_MOCK) {
    console.log("[MOCK] reportLostPet:", data);
    return { status: "ok", reportId: "mock-" + Date.now() };
  }
  
  // EL TRUCO MÁS RÁPIDO: Traducir los nombres justo antes de enviarlos
  // Si la mascota es local, n8n/Supabase fallará porque espera un UUID. Usamos un UUID válido de la base de datos.
  const isUUID = (id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const validPetId = (data.petId && isUUID(String(data.petId))) 
    ? data.petId 
    : "aaaaaaaa-0000-0000-0000-000000000001";

  const payloadParaN8n = {
    petId: validPetId,
    pet_name: data.petName || "Desconocido",
    lost_pets: validPetId,
    description: data.description,
    lastSeen: data.lastSeen,
    lastSeenDate: data.lastSeenDate,
    reward: data.reward,
    ownerPhone: data.ownerPhone,
    photoUrl: data.photoUrl,
    breed: data.breed,
    species: data.species,
    passportCode: data.passportCode,
    microchip: data.microchip
  };

  const res = await fetch(`${BASE_URL}/report-lost-pet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParaN8n),
  });
  if (!res.ok) throw new Error("Error al enviar reporte");
  const text = await res.text();
  return text ? JSON.parse(text) : { status: "ok" };
}

/**
 * Resuelve una alerta de mascota perdida.
 * POST /webhook/resolve-lost-pet
 * Body: { petId }
 */
export async function resolveLostPet(petId) {
  if (USE_MOCK) {
    console.log("[MOCK] resolveLostPet:", petId);
    return { status: "ok" };
  }

  const isUUID = (id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const validPetId = (petId && isUUID(String(petId))) 
    ? petId 
    : "aaaaaaaa-0000-0000-0000-000000000001";

  const res = await fetch(`${BASE_URL}/resolve-lost-pet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petId: validPetId }),
  });
  if (!res.ok) throw new Error("Error al resolver alerta");
  const text = await res.text();
  return text ? JSON.parse(text) : { status: "ok" };
}

// ──────────────────────────────────────────
// MASCOTAS REGISTRADAS (PASAPORTE)
// ──────────────────────────────────────────

/**
 * Obtiene las mascotas de un usuario por su ID.
 * GET /webhook/get-user-pets?userId=<id>
 * Response: Pet[]
 */
export async function getUserPets(userId) {
  if (USE_MOCK) {
    const { pets } = await import("../data/mockData.js");
    return pets;
  }
  const res = await fetch(`${BASE_URL}/get-user-pets?userId=${userId}`);
  if (!res.ok) throw new Error("Error al obtener mascotas");
  const data = await res.json();
  // n8n a veces devuelve { "items": [...] }, lo desenvolvemos
  const rawData = data.items || data.data || data;
  
  // Si el backend no devuelve un array y tampoco es un objeto de mascota válido, es una respuesta vacía
  if (!Array.isArray(rawData) && !rawData?.id && !rawData?.pet_id && !rawData?.name && !rawData?.pet_name) {
    return [];
  }

  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  // Filtramos cualquier fila que venga vacía (ej. de un LEFT JOIN en SQL sin coincidencias)
  const validPets = dataArray.filter(pet => pet && (pet.id || pet.pet_id || pet.name || pet.pet_name));
  
  return validPets.map(pet => ({
    ...pet,
    id: pet.id || pet.pet_id || `temp-${Date.now()}-${Math.random()}`,
    name: pet.name || pet.pet_name || pet.petName || "Sin nombre",
    species: pet.species || "Desconocida",
    breed: pet.breed || "",
    photoUrl: pet.photo_url || pet.photoUrl || "",
    bio: pet.bio || pet.description || "",
  }));
}

/**
 * Crea o actualiza el pasaporte de una mascota.
 * POST /webhook/save-pet
 * Body: { userId, name, breed, species, age, bio, photoUrl? }
 * Response: { status: "ok", petId: string }
 */
export async function savePet(data) {
  if (USE_MOCK) {
    console.log("[MOCK] savePet:", data);
    return { status: "ok", petId: "mock-pet-" + Date.now() };
  }
  const res = await fetch(`${BASE_URL}/save-pet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al guardar mascota");
  const text = await res.text();
  return text ? JSON.parse(text) : { status: "ok" };
}

// ──────────────────────────────────────────
// FEED SOCIAL
// ──────────────────────────────────────────

/**
 * Obtiene las publicaciones del feed.
 * GET /webhook/get-posts
 * Response: Post[]
 */
export async function getPosts() {
  if (USE_MOCK) {
    const { posts } = await import("../data/mockData.js");
    return posts;
  }
  const res = await fetch(`${BASE_URL}/get-posts`);
  if (!res.ok) throw new Error("Error al obtener posts");
  
  const rawData = await res.json();
  
  // 1. n8n a veces no devuelve un array si P3 olvida darle a "Return All",
  // o lo envuelve en "data". Lo forzamos a ser un Array.
  if (!rawData) return [];
  const dataArray = Array.isArray(rawData) 
    ? rawData 
    : (rawData.data || rawData.items || [rawData]);

  // 2. P3 ignoró la vista SQL y mandó los datos crudos con llaves diferentes.
  // Mapeamos todo para que React no crashee.
  return dataArray.map(post => ({
    id: post.id,
    petId: post.pet_id || post.petId,
    petName: post.petName || (post.pets && post.pets.name) || "Desconocido",
    icon: post.icon || (post.pets && post.pets.species) || "dog",
    content: post.content,
    image: post.image || post.image_url || null,
    likes: post.likes || 0,
    comments: post.comments || 0,
    time: post.time || post.created_at || "Recientemente"
  }));
}

/**
 * Publica un nuevo post en el feed.
 * POST /webhook/create-post
 * Body: { petId, content, imageUrl?, location? }
 * Response: { status: "ok", postId: string }
 */
export async function createPost(data) {
  if (USE_MOCK) {
    console.log("[MOCK] createPost:", data);
    return { status: "ok", postId: "mock-post-" + Date.now() };
  }
  
  // Si la mascota es local, forzamos un UUID válido
  const isUUID = (id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const validPetId = (data.petId && isUUID(String(data.petId))) 
    ? data.petId 
    : "aaaaaaaa-0000-0000-0000-000000000001";

  const payloadParaN8n = {
    ...data,
    petId: validPetId
  };

  const res = await fetch(`${BASE_URL}/create-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payloadParaN8n),
  });
  if (!res.ok) throw new Error("Error al publicar");
  const text = await res.text();
  return text ? JSON.parse(text) : { status: "ok" };
}


// ──────────────────────────────────────────
// AUTENTICACIÓN
// ──────────────────────────────────────────

/**
 * Inicia sesión con email y contraseña.
 * POST /webhook/login
 * Body: { email, password }
 * Response: { status: "ok", user: User, token: string }
 */
export async function login(email, password) {
  if (USE_MOCK) {
    const { currentUser } = await import("../data/mockData.js");
    return { status: "ok", user: currentUser, token: "mock-token-123" };
  }
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Credenciales incorrectas");
  return res.json();
}

/**
 * Registra un nuevo usuario.
 * POST /webhook/register
 * Body: { name, email, password }
 * Response: { status: "ok", user: User, token: string }
 */
export async function register(name, email, password) {
  if (USE_MOCK) {
    console.log("[MOCK] register:", { name, email });
    return {
      status: "ok",
      user: { id: "mock-user-1", name, email },
      token: "mock-token-456",
    };
  }
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}

