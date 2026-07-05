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
  return res.json();
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
  const res = await fetch(`${BASE_URL}/report-lost-pet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar reporte");
  return res.json();
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
  return res.json();
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
  return res.json();
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
  return res.json();
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
  const res = await fetch(`${BASE_URL}/create-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al publicar");
  return res.json();
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

