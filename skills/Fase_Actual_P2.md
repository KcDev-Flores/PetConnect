# 🔌 Fase Actual — Integración Adelantada por Persona 2 (P2)

> **Contexto:** La base de datos de Supabase aún no ha sido creada por P5, y P3 aún no tiene flujos activos en n8n.
> Para no bloquear el avance del frontend, **P2 tomó la decisión de suponer la estructura completa del backend y la base de datos**, e integró toda la lógica del frontend como si los endpoints ya existieran.
>
> Esto es trabajo "optimista": el frontend ya está listo para conectarse en el momento en que P3 y P5 levanten su parte. No habrá que volver a tocar el frontend — solo activar el backend.

---

## 🧑‍💻 Qué hizo P2 en esta fase

### 1. Creó el archivo de configuración de API

Archivo: `frontend/src/services/api.js`

Este archivo centraliza **todas las llamadas HTTP al backend de n8n**. Mientras los endpoints no existen, cada función tiene un modo "mock" activado por una variable de entorno. Cuando P3 levante los webhooks, solo se cambia esa variable y todo el frontend empieza a usar datos reales sin tocar nada más.

```js
// frontend/src/services/api.js

const BASE_URL = import.meta.env.VITE_N8N_BASE_URL || "http://localhost:5678/webhook";
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

/**
 * Agrega un avistamiento a un reporte existente.
 * POST /webhook/add-sighting
 * Body: { reportId, comment, location, lat?, lng? }
 * Response: { status: "ok" }
 */
export async function addSighting(data) {
  if (USE_MOCK) {
    console.log("[MOCK] addSighting:", data);
    return { status: "ok" };
  }
  const res = await fetch(`${BASE_URL}/add-sighting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al enviar avistamiento");
  return res.json();
}

// ──────────────────────────────────────────
// BÚSQUEDA POR FOTO (IA)
// ──────────────────────────────────────────

/**
 * Envía una foto para búsqueda por IA (Fal + Exa).
 * POST /webhook/search-by-photo
 * Body: { photoUrl: string }
 * Response: { matchFound: boolean, pet?: PetMatch }
 */
export async function searchByPhoto(photoUrl) {
  if (USE_MOCK) {
    console.log("[MOCK] searchByPhoto:", photoUrl);
    return { matchFound: false };
  }
  const res = await fetch(`${BASE_URL}/search-by-photo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photoUrl }),
  });
  if (!res.ok) throw new Error("Error en búsqueda por foto");
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
 * Body: { petId, content, imageUrl? }
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
    return { status: "ok", user: { id: "mock-user-1", name, email }, token: "mock-token-456" };
  }
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}
```

---

### 2. Creó el archivo `.env.example`

Archivo: `frontend/.env.example`

Este archivo documenta las variables de entorno que deben configurarse. P5 lo copia a `.env.local` con los valores reales cuando levante el deploy en Netlify.

```env
# URL base de los webhooks de n8n (sin slash al final)
# Ejemplo: https://tu-instancia.n8n.io/webhook
VITE_N8N_BASE_URL=https://PENDIENTE.n8n.io/webhook

# Cambiar a "false" cuando el backend esté listo para usar datos reales
VITE_USE_MOCK=true
```

---

### 3. Supuso los tipos de datos

Estos son los contratos de datos que P2 asumió. **P4 debe verificar que coincidan con el esquema DataMCP** y P3 debe asegurarse de que n8n devuelva exactamente este formato.

#### Tipo: `LostReport` (mascota perdida)
```json
{
  "id": "uuid",
  "petName": "Toby",
  "breed": "Beagle",
  "species": "Perro",
  "description": "Beagle tricolor, collar rojo...",
  "lastSeen": "Colonia Escalón, San Salvador",
  "lastSeenDate": "3 Jul 2026",
  "reward": "$50",
  "status": "activo",
  "ownerName": "Pedro Hernández",
  "ownerPhone": "+503 7123-4567",
  "photoUrl": "https://...",
  "sightings": [
    {
      "id": "uuid",
      "lat": 35.5,
      "lng": 45.2,
      "comment": "Lo vi cruzando la calle",
      "author": "Lucía M.",
      "time": "Hace 3h",
      "confidence": 0.9
    }
  ]
}
```

#### Tipo: `Pet` (pasaporte de mascota)
```json
{
  "id": "uuid",
  "name": "Max",
  "breed": "Golden Retriever",
  "species": "Perro",
  "age": "3 años",
  "bio": "Le encanta nadar...",
  "owner": "María González",
  "photoUrl": "https://...",
  "followers": 128,
  "posts": 24
}
```

#### Tipo: `Post` (feed social)
```json
{
  "id": "uuid",
  "petId": "uuid",
  "petName": "Max",
  "content": "¡Primer día en la playa!",
  "imageUrl": null,
  "likes": 42,
  "comments": 8,
  "time": "Hace 2 horas"
}
```

#### Tipo: `User` (usuario autenticado)
```json
{
  "id": "uuid",
  "name": "María González",
  "email": "maria@email.com",
  "location": "San Salvador, El Salvador",
  "joined": "Marzo 2026",
  "pets": ["uuid-pet-1"]
}
```

---

## 🗄️ Lo que P5 (Supabase) debe hacer ahora

### Script SQL completo

Copia y pega este script en el **SQL Editor de Supabase** (Database → SQL Editor → New Query). El orden importa por las relaciones.

```sql
-- ============================================================
-- PetConnect — Schema completo
-- Basado en los tipos supuestos por P2
-- Ejecutar en orden, no saltar ninguna sección
-- ============================================================

-- 1. EXTENSIÓN para UUIDs automáticos
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 2. TABLA: users (usuarios registrados)
-- ============================================================
CREATE TABLE users (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,           -- nunca se expone al frontend
  avatar_url  TEXT,
  location    TEXT DEFAULT 'El Salvador',
  joined_at   TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 3. TABLA: pets (mascotas registradas / pasaportes)
-- ============================================================
CREATE TABLE pets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  breed       TEXT,
  species     TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')) DEFAULT 'Perro',
  age         TEXT,                      -- ej: "3 años", "8 meses"
  bio         TEXT,
  photo_url   TEXT,
  followers   INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 4. TABLA: posts (feed social)
-- ============================================================
CREATE TABLE posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image_url   TEXT,
  likes       INT DEFAULT 0,
  comments    INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 5. TABLA: lost_pets (reportes de mascotas perdidas)
-- ============================================================
CREATE TABLE lost_pets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name        TEXT NOT NULL,
  breed           TEXT,
  species         TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')) DEFAULT 'Perro',
  description     TEXT,
  last_seen       TEXT,                  -- descripción del lugar en texto libre
  last_seen_date  DATE DEFAULT CURRENT_DATE,
  reward          TEXT,                  -- ej: "$50", NULL si no hay
  status          TEXT CHECK (status IN ('activo', 'encontrado', 'cerrado')) DEFAULT 'activo',
  owner_name      TEXT NOT NULL,
  owner_phone     TEXT NOT NULL,
  photo_url       TEXT,
  -- Campos añadidos por IA (P4 los completa después del análisis de Fal)
  ai_breed        TEXT,                  -- raza detectada por Fal
  ai_color        TEXT,                  -- color detectado por Fal
  ai_size         TEXT,                  -- tamaño detectado por Fal
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 6. TABLA: sightings (avistamientos de mascotas perdidas)
-- ============================================================
CREATE TABLE sightings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id   UUID NOT NULL REFERENCES lost_pets(id) ON DELETE CASCADE,
  comment     TEXT NOT NULL,
  location    TEXT,                      -- descripción del lugar en texto
  lat         FLOAT,                     -- coordenada Y (para el mapa)
  lng         FLOAT,                     -- coordenada X (para el mapa)
  author      TEXT DEFAULT 'Anónimo',
  confidence  FLOAT DEFAULT 0.7 CHECK (confidence BETWEEN 0 AND 1),
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 7. TABLA: breeds (catálogo de razas — solo lectura)
-- Poblada con datos iniciales, no cambia durante el hackathon
-- ============================================================
CREATE TABLE breeds (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL UNIQUE,
  species TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')),
  size    TEXT CHECK (size IN ('Pequeño', 'Mediano', 'Grande')),
  origin  TEXT
);

-- Datos iniciales del catálogo de razas (basados en mockData.js de P1)
INSERT INTO breeds (name, species, size, origin) VALUES
  ('Golden Retriever', 'Perro',  'Grande',   'Reino Unido'),
  ('Siamés',           'Gato',   'Mediano',  'Tailandia'),
  ('Labrador',         'Perro',  'Grande',   'Canadá'),
  ('Persa',            'Gato',   'Mediano',  'Irán'),
  ('Bulldog Francés',  'Perro',  'Pequeño',  'Francia'),
  ('Maine Coon',       'Gato',   'Grande',   'Estados Unidos'),
  ('Beagle',           'Perro',  'Mediano',  'Reino Unido'),
  ('Husky Siberiano',  'Perro',  'Grande',   'Rusia'),
  ('Chihuahua',        'Perro',  'Pequeño',  'México'),
  ('Mestizo',          'Perro',  'Mediano',  'El Salvador');


-- ============================================================
-- 8. DATOS DE PRUEBA (basados en mockData.js de P1)
-- Ejecutar solo si la DB está vacía y quieren probar sin Firecrawl
-- ============================================================

-- Usuario de prueba (contraseña: "test1234" — hasheada para ejemplo)
INSERT INTO users (id, name, email, password_hash, location) VALUES
  ('11111111-0000-0000-0000-000000000001', 'María González', 'maria@email.com', 'hash_placeholder', 'San Salvador, El Salvador'),
  ('22222222-0000-0000-0000-000000000002', 'Carlos Ruiz',    'carlos@email.com', 'hash_placeholder', 'Santa Tecla, El Salvador');

-- Mascotas de prueba
INSERT INTO pets (id, owner_id, name, breed, species, age, bio, followers, posts_count) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Max',   'Golden Retriever', 'Perro', '3 años', 'Le encanta nadar y perseguir pelotas.', 128, 24),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Luna',  'Siamés',           'Gato',  '2 años', 'Curiosa y vocal. Duerme al sol.', 89, 15),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Rocky', 'Bulldog Francés',  'Perro', '4 años', 'Pequeño pero con mucha personalidad.', 203, 31);

-- Reportes de mascotas perdidas de prueba
INSERT INTO lost_pets (id, pet_name, breed, species, description, last_seen, last_seen_date, reward, owner_name, owner_phone) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Toby',  'Beagle', 'Perro', 'Beagle tricolor, collar rojo con placa.', 'Colonia Escalón, San Salvador', '2026-07-03', '$50',  'Pedro Hernández', '+503 7123-4567'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Michi', 'Persa',  'Gato',  'Gato persa blanco, ojos azules, sin collar.', 'Antiguo Cuscatlán', '2026-07-02', NULL, 'Laura Vega',      '+503 7890-1234');

-- Avistamientos de prueba
INSERT INTO sightings (report_id, comment, location, lat, lng, author, confidence) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Lo vi cruzando la calle cerca del parque', 'Parque Escalón', 35, 45, 'Lucía M.', 0.9),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Escuché ladridos en esa zona anoche',       'Zona residencial', 55, 38, 'Jorge P.', 0.6),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Vi un beagle similar en la panadería',       'Panadería Escalón', 42, 62, 'Sofía R.', 0.75),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Gato blanco en el techo de una casa',        'Antiguo Cuscatlán residencial', 30, 70, 'Diego S.', 0.85);
```

---

## ⚙️ Lo que P3 (n8n) debe hacer ahora

P3 debe crear **un flujo en n8n por cada endpoint** que P2 supuso. La tabla de referencia:

| Endpoint (P2 lo llama así) | Método | Nodo n8n principal | Tabla Supabase |
|---|---|---|---|
| `/get-lost-pets` | GET | Supabase → Select | `lost_pets` + JOIN `sightings` |
| `/report-lost-pet` | POST | Supabase → Insert | `lost_pets` |
| `/add-sighting` | POST | Supabase → Insert | `sightings` |
| `/search-by-photo` | POST | HTTP Fal → HTTP Exa → Supabase Select | `lost_pets` |
| `/get-user-pets` | GET | Supabase → Select | `pets` WHERE `owner_id` |
| `/save-pet` | POST | Supabase → Insert/Upsert | `pets` |
| `/get-posts` | GET | Supabase → Select | `posts` + JOIN `pets` |
| `/create-post` | POST | Supabase → Insert | `posts` |
| `/login` | POST | Supabase → Select + validar hash | `users` |
| `/register` | POST | Supabase → Insert | `users` |

### Regla crítica para todos los flujos:

El webhook **SIEMPRE** debe terminar con el nodo `Respond to Webhook` devolviendo el formato que P2 espera. Si la respuesta no coincide con el JSON descrito en `api.js`, el frontend romperá.

### Flujo mínimo prioritario (hacer primero):

```
[Webhook POST /report-lost-pet]
  → [Supabase: Insert en lost_pets]
  → [Respond to Webhook: { "status": "ok", "reportId": "{{$json.id}}" }]
```

Y el segundo flujo para que el frontend pueda mostrar datos:

```
[Webhook GET /get-lost-pets]
  → [Supabase: Select * FROM lost_pets WHERE status = 'activo']
  → [Supabase: Select * FROM sightings WHERE report_id IN (...)]  ← opcional, P4 puede añadirlo
  → [Respond to Webhook: <array de reportes>]
```

---

## 🔄 Cómo se activa el flujo real (cuando todo esté listo)

Cuando P3 tenga los webhooks activos y P5 haya creado la base de datos, el único cambio necesario es actualizar el archivo `.env.local` en el frontend:

```env
# Antes (modo mock)
VITE_N8N_BASE_URL=https://PENDIENTE.n8n.io/webhook
VITE_USE_MOCK=true

# Después (modo real)
VITE_N8N_BASE_URL=https://instancia-real.n8n.io/webhook
VITE_USE_MOCK=false
```

En Netlify, P5 actualiza estas mismas variables en: **Site Settings → Environment Variables**.

No se toca ningún componente. No se toca ninguna página. El frontend automáticamente empieza a usar los datos reales.

---

## ✅ Checklist de esta fase

| Tarea | Responsable | Estado |
|---|---|---|
| Crear `frontend/src/services/api.js` con todos los endpoints supuestos | **P2** | ✅ Hecho |
| Crear `frontend/.env.example` con las variables necesarias | **P2** | ✅ Hecho |
| Documentar los tipos de datos esperados | **P2** | ✅ Hecho |
| Ejecutar el script SQL en Supabase | **P5** | ⏳ Pendiente |
| Crear los flujos en n8n con los paths de esta guía | **P3** | ⏳ Pendiente |
| Actualizar `VITE_N8N_BASE_URL` y `VITE_USE_MOCK=false` | **P5** | ⏳ Pendiente |
| Verificar que cada endpoint devuelva el JSON exacto esperado | **P3 + P2** | ⏳ Pendiente |
