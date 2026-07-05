# 🧠 Guía para P3 + P4: Backend con n8n (desde cero)

> **Propósito:** Reemplazar un backend tradicional de Express con flujos visuales + código en n8n.
> P2 ya dejó el frontend listo con modo mock — solo toca activar los webhooks reales.
>
> **Estructura de cada workflow:** 2 nodos únicamente → `[Webhook] → [Code]`
> Sin "Respond to Webhook". El Webhook se configura con **Response Data: When Last Node Finishes**
> y automáticamente devuelve lo que retorne (`return`) el Code node.
>
> **HTTP desde el Code node:** n8n **no tiene `$http`**. Se usa `fetch()` nativo.
>
> **Tiempo estimado:** 2-3 horas los 12 workflows + 1 hora IA.

---

## 📦 Fase 0: Preparación

### 0.1 Crear cuenta en n8n Cloud

1. Ir a https://app.n8n.cloud/register
2. Registrarse con email o Google
3. Confirmar email
4. Al entrar verás el dashboard principal:

```
┌──────────────────────────────────────────────────┐
│  n8n  [Workflows]  [Credentials]  [Variables]    │
│                                                   │
│     Welcome to n8n!                               │
│     [+ New Workflow]      [Browse Templates]      │
│                                                   │
│     (tu lista de workflows vacía aquí)            │
└──────────────────────────────────────────────────┘
```

### 0.2 Variables de n8n

Las variables se configuran en **Settings → Variables** (barra lateral izquierda).
El syntaxis dentro del Code node es: `$vars.NOMBRE_VARIABLE`.

**Variables obligatorias a crear:**

| Variable | Valor | Para qué se usa |
|----------|-------|-----------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | URL del proyecto Supabase |
| `SUPABASE_SECRET_KEY` | `eyJhbGciOiJ...` | service_role key (admin) |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJ...` | anon key (frontend) |
| `JWT_SECRET` | `petconnect-secret-2026` | Token de sesión (si se usa) |
| `GOOGLE_VISION_KEY` | `AIzaSy...` | Google Cloud Vision API |
| `EXA_KEY` | `bearer_xxx...` | Exa API |

**En el Code node se accede así:**

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;
const GV_KEY = $vars.GOOGLE_VISION_KEY;
const EXA_KEY = $vars.EXA_KEY;
```

### 0.3 P5 debe ejecutar el schema.sql en Supabase

Antes de empezar, P5 debe haber ido a Supabase → **SQL Editor** → pegar `supabase/schema.sql` y ejecutarlo.

**Tablas del schema actual:**

| Tabla | Contenido |
|-------|-----------|
| `users` | Dueños registrados (id, name, email, password_hash, avatar_url, location, created_at) |
| `pets` | Perfiles de mascotas (id, owner_id → users, name, breed, species, age, sex, color, weight, bio, photo_url, followers, posts_count) |
| `vaccines` | Vacunas (id, pet_id → pets, name, applied_date, next_due_date, veterinarian, notes) |
| `vet_records` | Visitas al vet (id, pet_id → pets, clinic_name, vet_name, phone, visit_date, condition, notes) |
| `posts` | Feed social (id, pet_id → pets, content, image_url, likes, comments) |
| `comments` | Comentarios (id, post_id → posts, author_id → users, content) |
| `lost_pets` | Reportes de emergencia (id, pet_id → pets, description, last_seen, last_seen_lat/lng, reward, status, owner_name, owner_phone, photo_url) |

### 0.4 Entender cómo se conecta todo

```
Frontend (React)
  │
  │ fetch() a URL: https://tunombre.app.n8n.cloud/webhook/<path>
  ▼
n8n Webhook node  (recibe JSON, config: Response Data → When Last Node Finishes)
  │
  ▼
Code node  (JavaScript: valida, transforma, hace llamadas HTTP a Supabase REST API con fetch())
  │
  ▼  (el return del Code node es la respuesta automática)
Frontend recibe JSON
```

**Por qué 2 nodos y no 3:**
- El nodo Webhook puede configurarse con **"Response Data: When Last Node Finishes"**
- Esto hace que espere a que el Code node termine y use su `return` como respuesta
- Así nos ahorramos el nodo "Respond to Webhook" y el error "Unused Respond to Webhook"

### 0.5 Cómo hacer HTTP desde el Code node

**¡Importante!** El Code node de n8n **NO soporta `$http`**. Usa `fetch()` nativo:

```javascript
// ✅ CORRECTO
const response = await fetch(`${SB_URL}/rest/v1/users`, {
  method: 'GET',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`
  }
});
const data = await response.json();

// ❌ INCORRECTO (no existe $http en n8n)
// const res = await $http.request({ ... });
```

**Para POST/PATCH:** el `body` debe ser string JSON:

```javascript
const response = await fetch(`${SB_URL}/rest/v1/users`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: body.name,
    email: body.email
  })
});
const data = await response.json();
```

---

## 🎮 Fase 1: Tutorial rápido de n8n (hacer 1 vez para aprender)

### 1.1 Crear un workflow

- Click en **"New Workflow"** (botón grande o + en sidebar)
- Se abre un canvas en blanco
- Nómbralo: `test-hello` (click en el nombre "New workflow" arriba)

### 1.2 Agregar nodo Webhook (la entrada)

- Click en **"+"** en el canvas
- En la barra de búsqueda escribe **Webhook**
- Click en el nodo **Webhook** para agregarlo
- Se abre el panel de configuración a la derecha:

```
┌──────────────────────────────────────────┐
│  Webhook                                 │
│                                          │
│  Method:            [POST] ▼             │
│  Path:              test-hello           │
│                                          │
│  ≈≈≈ OPCIONES ≈≈≈                       │
│  Response Data:    [When Last Node Finishes] ▼  ← ESTO ES CLAVE
│                                          │
│  Webhook URLs                            │
│  ▶ Test: (aparece al hacer Listen)       │
│  ▶ Production: (aparece al activar)      │
└──────────────────────────────────────────┘
```

**IMPORTANTE:** En **Response Data** selecciona **"When Last Node Finishes"**.
Esto le dice al Webhook que espere a que corra el Code node y use su `return` como respuesta.

Ahora haz click en **"Listen for Test Event"** (botón en la parte inferior del panel). Esto activa el webhook temporalmente y te muestra la URL:

```
https://tunombre.app.n8n.cloud/webhook-test/test-hello
```

### 1.3 Agregar nodo Code (la lógica)

- Click en **"+"** al lado del Webhook (en el canvas sale un conector)
- Busca **Code** en el buscador
- Selecciona **Code (JavaScript)**
- En el panel derecho escribe:

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

// ── Código ──
const body = $input.first().json;

return {
  message: "Hola desde n8n!",
  recibiste: body,
  supabase_url: SB_URL
};
```

### 1.4 Probar el flujo

- Click en **"Execute Workflow"** (arriba a la derecha, icono ▶️)
- O desde fuera: envía un POST a la URL de test

```powershell
$body = @{ nombre = "Max"; especie = "Perro" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://tunombre.app.n8n.cloud/webhook-test/test-hello" -Method POST -Body $body -ContentType "application/json"
```

Deberías recibir:
```json
{
  "message": "Hola desde n8n!",
  "recibiste": { "nombre": "Max", "especie": "Perro" },
  "supabase_url": "https://xxx.supabase.co"
}
```

### 1.5 Activar un workflow para producción

Cuando ya funcione en test:
- Click en **"Save"** (Ctrl+S, o botón arriba a la derecha)
- Click en el toggle **"Active"** (se pone verde)
- Ahora la URL de producción aparece en el nodo Webhook:
  `https://tunombre.app.n8n.cloud/webhook/test-hello`

**Diferencia clave:**
- `/webhook-test/` → solo funciona mientras el panel del nodo está abierto (pruebas)
- `/webhook/` → funciona 24/7 mientras el workflow esté en **Active**

### 1.6 Lecciones aprendidas para todos los flujos

1. El **Webhook node** tiene un campo `Path` — ese path es el endpoint que llama el frontend
2. Configurar **Response Data: When Last Node Finishes** — sin "Respond to Webhook"
3. El **Code node** tiene todo el JavaScript: config, validación, llamadas HTTP
4. Usar **`fetch()`** para HTTP, **no `$http`**
5. El `return` del Code node es la respuesta que recibe el frontend
6. Para probar local: `/webhook-test/` con el botón "Listen"
7. Para producción: **Save** + **Active** → usas `/webhook/`

---

## 🏗️ Fase 2: Crear los 12 workflows (P3 + P4)

### IMPORTANTE: Cómo crear cada workflow

Para cada endpoint:

1. Click **"New Workflow"** → poner nombre según la tabla
2. Agregar **Webhook node**: Method, Path, **Response Data: When Last Node Finishes**
3. Click **"Listen for Test Event"** → obtener URL temporal
4. Agregar **Code node**: pegar el código JS (incluye la config al inicio)
5. Click **"Execute Workflow"** para probar
6. Click **"Save"** → toggle **"Active"** para producción

**¡NO agregar "Respond to Webhook"!**

---

### Workflow 1: `GET /get-lost-pets`

**Webhook:** GET | Path: `get-lost-pets`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

// ── Consultar reportes activos con JOIN a pets ──
const response = await fetch(
  `${SB_URL}/rest/v1/lost_pets?select=*,pets(name,breed,species)&status=eq.activo&order=created_at.desc`,
  {
    method: 'GET',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`
    }
  }
);

const res = await response.json();

// Mapear snake_case → camelCase para el frontend
return res.map(r => ({
  id: r.id,
  petName: r.pets?.name || 'Desconocido',
  breed: r.pets?.breed || 'Desconocido',
  species: r.pets?.species || 'Otro',
  description: r.description,
  lastSeen: r.last_seen,
  lastSeenDate: r.last_seen_date,
  reward: r.reward,
  status: r.status,
  ownerName: r.owner_name,
  ownerPhone: r.owner_phone,
  photoUrl: r.photo_url,
  sightings: []  // Tabla sightings no existe en el schema actual
}));
```

---

### Workflow 2: `POST /report-lost-pet`

**Webhook:** POST | Path: `report-lost-pet`

**El frontend envía:** `{ petName, breed, species, description, lastSeen, ownerPhone, photoUrl, reward? }`

**Desafío del schema actual:** `lost_pets` tiene `pet_id` FK a `pets`, no guarda nombre/raza directo.
El Code node debe: (1) crear/obtener el pet → (2) insertar en lost_pets con ese pet_id.

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

// ── Código ──
const body = $input.first().json;

if (!body.petName || !body.ownerPhone) {
  return { status: "error", message: "Faltan campos obligatorios: petName, ownerPhone" };
}

// 1. Buscar si ya existe un pet con ese nombre
const existingPetResponse = await fetch(
  `${SB_URL}/rest/v1/pets?name=eq.${encodeURIComponent(body.petName)}&select=id&limit=1`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);
const existingPet = await existingPetResponse.json();

let petId;

if (existingPet.length > 0) {
  petId = existingPet[0].id;
} else {
  // 2. No existe → crear pet (owner_id = primer usuario de la DB)
  const usersResponse = await fetch(
    `${SB_URL}/rest/v1/users?select=id&limit=1`,
    {
      method: 'GET',
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    }
  );
  const users = await usersResponse.json();
  const defaultOwnerId = users[0]?.id || '00000000-0000-0000-0000-000000000000';

  const newPetResponse = await fetch(`${SB_URL}/rest/v1/pets`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      owner_id: defaultOwnerId,
      name: body.petName,
      breed: body.breed || null,
      species: body.species || 'Otro'
    })
  });
  const newPet = await newPetResponse.json();
  petId = newPet[0].id;
}

// 3. Insertar en lost_pets con el pet_id obtenido
const reportResponse = await fetch(`${SB_URL}/rest/v1/lost_pets`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    pet_id: petId,
    description: body.description || null,
    last_seen: body.lastSeen || null,
    reward: body.reward || null,
    status: 'activo',
    owner_name: body.ownerName || 'Anónimo',
    owner_phone: body.ownerPhone,
    photo_url: body.photoUrl || null
  })
});

const report = await reportResponse.json();

return {
  status: "ok",
  reportId: report[0].id
};
```

---

### Workflow 3: `POST /add-sighting`

**Webhook:** POST | Path: `add-sighting`

> ⚠️ La tabla `sightings` fue eliminada del schema. Este workflow existe solo para
> que el frontend no rompa cuando `VITE_USE_MOCK=false`. Devuelve `{ status: "ok" }`
> pero no guarda nada.

```javascript
// Este endpoint ya no tiene tabla donde guardar.
// Se mantiene para no romper el frontend (retorna siempre éxito).
return { status: "ok", message: "Sightings no disponible en esta versión" };
```

---

### Workflow 4: `GET /get-user-pets`

**Webhook:** GET | Path: `get-user-pets`

**El frontend llama:** `/webhook/get-user-pets?userId=<uuid>`
Los query params se acceden con `$input.first().params.userId`.

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

// ── Obtener userId del query string ──
const userId = $input.first().params?.userId;

if (!userId) return [];

const response = await fetch(
  `${SB_URL}/rest/v1/pets?owner_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();

return res.map(p => ({
  id: p.id,
  name: p.name,
  breed: p.breed,
  species: p.species,
  age: p.age,
  sex: p.sex,
  color: p.color,
  weight: p.weight,
  bio: p.bio,
  photoUrl: p.photo_url,
  followers: p.followers,
  posts: p.posts_count
}));
```

---

### Workflow 5: `POST /save-pet`

**Webhook:** POST | Path: `save-pet`

**Frontend envía:** `{ userId, name, breed, species, age, bio, photoUrl? }`
**Schema actual acepta además:** `sex, color, weight`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.userId || !body.name) {
  return { status: "error", message: "Faltan userId o name" };
}

const response = await fetch(`${SB_URL}/rest/v1/pets`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    owner_id: body.userId,
    name: body.name,
    breed: body.breed || null,
    species: body.species || 'Otro',
    age: body.age || null,
    sex: body.sex || null,
    color: body.color || null,
    weight: body.weight || null,
    bio: body.bio || null,
    photo_url: body.photoUrl || null,
    followers: 0,
    posts_count: 0
  })
});

const res = await response.json();

return { status: "ok", petId: res[0].id };
```

---

### Workflow 6: `GET /get-posts`

**Webhook:** GET | Path: `get-posts`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const response = await fetch(
  `${SB_URL}/rest/v1/posts?select=*,pets(name,photo_url)&order=created_at.desc&limit=50`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();

return res.map(p => ({
  id: p.id,
  petId: p.pet_id,
  petName: p.pets?.name || 'Mascota',
  content: p.content,
  imageUrl: p.image_url,
  likes: p.likes,
  comments: p.comments,
  time: p.created_at
}));
```

---

### Workflow 7: `POST /create-post`

**Webhook:** POST | Path: `create-post`

**Frontend envía:** `{ petId, content, imageUrl? }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.petId || !body.content) {
  return { status: "error", message: "Faltan petId o content" };
}

// 1. Insertar el post
const postResponse = await fetch(`${SB_URL}/rest/v1/posts`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    pet_id: body.petId,
    content: body.content,
    image_url: body.imageUrl || null,
    likes: 0,
    comments: 0
  })
});

const postRes = await postResponse.json();

// 2. Incrementar posts_count en pets
const petResponse = await fetch(
  `${SB_URL}/rest/v1/pets?id=eq.${body.petId}&select=posts_count`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);
const petRes = await petResponse.json();

const currentCount = petRes[0]?.posts_count || 0;

await fetch(`${SB_URL}/rest/v1/pets?id=eq.${body.petId}`, {
  method: 'PATCH',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ posts_count: currentCount + 1 })
});

return { status: "ok", postId: postRes[0].id };
```

---

### Workflow 8: `POST /login`

**Webhook:** POST | Path: `login`

**Frontend envía:** `{ email, password }`
**Devuelve:** `{ status: "ok", user: User, token: string }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.email || !body.password) {
  return { status: "error", message: "Email y password requeridos" };
}

// Buscar usuario por email
const response = await fetch(
  `${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(body.email)}&select=*`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();
const user = res[0];

if (!user) {
  return { status: "error", message: "Credenciales incorrectas" };
}

// Comparar password (texto plano para hackathon)
if (user.password_hash !== body.password) {
  return { status: "error", message: "Credenciales incorrectas" };
}

// Token simple (no JWT real, suficiente para hackathon)
const token = `petconnect-token-${user.id}-${Date.now()}`;

return {
  status: "ok",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    location: user.location || 'El Salvador',
    joined: user.created_at,
    pets: []
  },
  token: token
};
```

---

### Workflow 9: `POST /register`

**Webhook:** POST | Path: `register`

**Frontend envía:** `{ name, email, password }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.name || !body.email || !body.password) {
  return { status: "error", message: "Nombre, email y password requeridos" };
}

// Verificar si el email ya existe
const existingResponse = await fetch(
  `${SB_URL}/rest/v1/users?email=eq.${encodeURIComponent(body.email)}&select=id`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const existing = await existingResponse.json();

if (existing.length > 0) {
  return { status: "error", message: "El email ya está registrado" };
}

// Crear usuario
const response = await fetch(`${SB_URL}/rest/v1/users`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    name: body.name,
    email: body.email,
    password_hash: body.password,
    location: 'El Salvador'
  })
});

const res = await response.json();
const user = res[0];
const token = `petconnect-token-${user.id}-${Date.now()}`;

return {
  status: "ok",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    location: user.location || 'El Salvador',
    joined: user.created_at,
    pets: []
  },
  token: token
};
```

---

### Workflow 10: `POST /search-by-photo` (P3 + P4)

**Webhook:** POST | Path: `search-by-photo`

**Frontend envía:** `{ photoUrl: string }`

**IA: Google Cloud Vision** (reemplaza a Fal). Endpoint:
```
POST https://vision.googleapis.com/v1/images:annotate?key=GV_KEY
```

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;
const GV_KEY = $vars.GOOGLE_VISION_KEY;

// ── Código ──
const body = $input.first().json;
const photoUrl = body.photoUrl;

if (!photoUrl) return { matchFound: false };

// ----- FASE 3: Mock (mientras Google Vision no esté listo) -----
// Descomentar para mockear:
// return {
//   matchFound: true,
//   pet: {
//     id: "mock-match-123",
//     petName: "Toby",
//     breed: "Beagle",
//     species: "Perro",
//     description: "Beagle tricolor, collar rojo",
//     lastSeen: "Colonia Escalón, San Salvador",
//     ownerName: "Pedro Hernández",
//     ownerPhone: "+503 7123-4567",
//     photoUrl: photoUrl,
//     status: "activo"
//   },
//   aiAnalysis: { breed: "Beagle", color: "Tricolor", size: "Mediano" }
// };

// ----- FASE 4: Google Vision API -----
// Envía la foto a Google Vision para obtener etiquetas
const visionResponse = await fetch(
  `https://vision.googleapis.com/v1/images:annotate?key=${GV_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { source: { imageUri: photoUrl } },
        features: [{ type: 'LABEL_DETECTION', maxResults: 15 }]
      }]
    })
  }
);

const visionRes = await visionResponse.json();

// Extraer labels del response de Vision
const labels = visionRes.responses?.[0]?.labelAnnotations || [];
const labelNames = labels.map(l => l.description.toLowerCase());

// Detectar tipo de animal
let species = 'Otro';
if (labelNames.some(l => ['perro', 'dog', 'canino', 'canine'].includes(l))) species = 'Perro';
if (labelNames.some(l => ['gato', 'cat', 'felino', 'feline'].includes(l))) species = 'Gato';

// Detectar raza (filtrar razas conocidas) — P4: expandir esta lista
const razasConocidas = ['beagle', 'golden retriever', 'labrador', 'bulldog', 'poodle',
  'chihuahua', 'husky', 'pastor alemán', 'rottweiler', 'doberman',
  'siames', 'persa', 'maine coon', 'bengalí'];
const breed = labelNames.find(l => razasConocidas.some(r => l.includes(r))) || 'Desconocido';

// Detectar color
const colores = ['blanco', 'white', 'negro', 'black', 'marrón', 'brown', 'gris', 'gray',
  'dorado', 'golden', 'tricolor', 'atigrado', 'atigrada'];
const color = labelNames.find(l => colores.some(c => l.includes(c))) || 'Desconocido';

// Buscar coincidencias en Supabase
const matchResponse = await fetch(
  `${SB_URL}/rest/v1/lost_pets?select=*,pets(name,breed,species)&status=eq.activo&limit=5`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const matchRes = await matchResponse.json();

// Filtrar matched pets en JS
const matched = matchRes.filter(r =>
  r.pets?.breed?.toLowerCase().includes(breed.toLowerCase()) ||
  labelNames.some(l => r.pets?.name?.toLowerCase().includes(l))
);

const match = matched[0];

return {
  matchFound: !!match,
  pet: match ? {
    id: match.id,
    petName: match.pets?.name,
    breed: match.pets?.breed,
    species: match.pets?.species,
    description: match.description,
    lastSeen: match.last_seen,
    ownerName: match.owner_name,
    ownerPhone: match.owner_phone,
    photoUrl: match.photo_url,
    status: match.status
  } : null,
  aiAnalysis: {
    breed: breed.charAt(0).toUpperCase() + breed.slice(1),
    color: color.charAt(0).toUpperCase() + color.slice(1),
    species: species,
    labels: labelNames.slice(0, 5)
  }
};
```

---

### Workflow 11 (NUEVO): `GET /get-vaccines`

**Webhook:** GET | Path: `get-vaccines`

**Frontend llama:** `/webhook/get-vaccines?petId=<uuid>`

Devuelve el historial de vacunas de una mascota.

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const petId = $input.first().params?.petId;
if (!petId) return [];

const response = await fetch(
  `${SB_URL}/rest/v1/vaccines?pet_id=eq.${encodeURIComponent(petId)}&order=applied_date.desc.nullslast`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();

return res.map(v => ({
  id: v.id,
  petId: v.pet_id,
  name: v.name,
  appliedDate: v.applied_date,
  nextDueDate: v.next_due_date,
  veterinarian: v.veterinarian,
  notes: v.notes
}));
```

---

### Workflow 12 (NUEVO): `POST /save-vaccine`

**Webhook:** POST | Path: `save-vaccine`

**Body:** `{ petId, name, appliedDate?, nextDueDate?, veterinarian?, notes? }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.petId || !body.name) {
  return { status: "error", message: "Faltan petId y name" };
}

const response = await fetch(`${SB_URL}/rest/v1/vaccines`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    pet_id: body.petId,
    name: body.name,
    applied_date: body.appliedDate || null,
    next_due_date: body.nextDueDate || null,
    veterinarian: body.veterinarian || null,
    notes: body.notes || null
  })
});

const res = await response.json();

return { status: "ok", vaccineId: res[0].id };
```

---

### Workflow 13 (NUEVO): `GET /get-vet-records`

**Webhook:** GET | Path: `get-vet-records`

**Frontend llama:** `/webhook/get-vet-records?petId=<uuid>`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const petId = $input.first().params?.petId;
if (!petId) return [];

const response = await fetch(
  `${SB_URL}/rest/v1/vet_records?pet_id=eq.${encodeURIComponent(petId)}&order=visit_date.desc.nullslast`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();

return res.map(r => ({
  id: r.id,
  petId: r.pet_id,
  clinicName: r.clinic_name,
  vetName: r.vet_name,
  phone: r.phone,
  visitDate: r.visit_date,
  condition: r.condition,
  notes: r.notes
}));
```

---

### Workflow 14 (NUEVO): `POST /save-vet-record`

**Webhook:** POST | Path: `save-vet-record`

**Body:** `{ petId, clinicName?, vetName?, phone?, visitDate?, condition?, notes? }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.petId) {
  return { status: "error", message: "Falta petId" };
}

const response = await fetch(`${SB_URL}/rest/v1/vet_records`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    pet_id: body.petId,
    clinic_name: body.clinicName || null,
    vet_name: body.vetName || null,
    phone: body.phone || null,
    visit_date: body.visitDate || null,
    condition: body.condition || null,
    notes: body.notes || null
  })
});

const res = await response.json();

return { status: "ok", recordId: res[0].id };
```

---

### Workflow 15 (NUEVO): `GET /get-comments`

**Webhook:** GET | Path: `get-comments`

**Frontend llama:** `/webhook/get-comments?postId=<uuid>`

Devuelve los comentarios de un post con el nombre del autor.

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const postId = $input.first().params?.postId;
if (!postId) return [];

const response = await fetch(
  `${SB_URL}/rest/v1/comments?select=*,users(name)&post_id=eq.${encodeURIComponent(postId)}&order=created_at.asc`,
  {
    method: 'GET',
    headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
  }
);

const res = await response.json();

return res.map(c => ({
  id: c.id,
  postId: c.post_id,
  authorId: c.author_id,
  authorName: c.users?.name || 'Anónimo',
  content: c.content,
  createdAt: c.created_at
}));
```

---

### Workflow 16 (NUEVO): `POST /add-comment`

**Webhook:** POST | Path: `add-comment`

**Body:** `{ postId, authorId, content }`

```javascript
// ── Config ──
const SB_URL = $vars.SUPABASE_URL;
const SB_KEY = $vars.SUPABASE_SECRET_KEY;

const body = $input.first().json;

if (!body.postId || !body.authorId || !body.content) {
  return { status: "error", message: "Faltan postId, authorId o content" };
}

const response = await fetch(`${SB_URL}/rest/v1/comments`, {
  method: 'POST',
  headers: {
    'apikey': SB_KEY,
    'Authorization': `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({
    post_id: body.postId,
    author_id: body.authorId,
    content: body.content
  })
});

const res = await response.json();

return { status: "ok", commentId: res[0].id };
```

---

## 📋 Fase 3: Checklist de activación

| # | Workflow | Method | Priority | Probar con |
|---|----------|--------|----------|------------|
| 1 | `get-lost-pets` | GET | 🔴 Alta | GET directo desde browser |
| 2 | `report-lost-pet` | POST | 🔴 Alta | `{ "petName": "Toby", "breed": "Beagle", "ownerPhone": "+503..." }` |
| 3 | `add-sighting` | POST | 🟢 Baja | `{ "reportId": "x", "comment": "test" }` (no guarda) |
| 4 | `get-user-pets` | GET | 🟡 Media | GET con `?userId=11111111-...` |
| 5 | `save-pet` | POST | 🟡 Media | `{ "userId": "uuid", "name": "Max" }` |
| 6 | `get-posts` | GET | 🟡 Media | GET directo |
| 7 | `create-post` | POST | 🟡 Media | `{ "petId": "uuid", "content": "Hola" }` |
| 8 | `login` | POST | 🔴 Alta | `{ "email": "maria@email.com", "password": "test1234" }` |
| 9 | `register` | POST | 🔴 Alta | `{ "name": "Test", "email": "t@t.com", "password": "123" }` |
| 10 | `search-by-photo` | POST | 🟢 Baja | `{ "photoUrl": "https://..." }` (requiere GV_KEY) |
| 11 | `get-vaccines` | GET | 🟢 Baja | GET con `?petId=uuid` |
| 12 | `save-vaccine` | POST | 🟢 Baja | `{ "petId": "uuid", "name": "Rabia" }` |
| 13 | `get-vet-records` | GET | 🟢 Baja | GET con `?petId=uuid` |
| 14 | `save-vet-record` | POST | 🟢 Baja | `{ "petId": "uuid", "condition": "Chequeo" }` |
| 15 | `get-comments` | GET | 🟢 Baja | GET con `?postId=uuid` |
| 16 | `add-comment` | POST | 🟢 Baja | `{ "postId": "uuid", "authorId": "uuid", "content": "Lindoo" }` |

### Cómo probar cada workflow

1. Abrir el workflow
2. Click en el nodo **Webhook**
3. Click **"Listen for Test Event"**
4. Aparece la URL de prueba
5. Desde el panel del Webhook hay una sección "Test Webhook":
   - Method: POST o GET según corresponda
   - Body (JSON): datos de prueba
   - Click **"Send"** → resultado en tiempo real

### Cómo ver errores si algo falla

Si un nodo se pone **rojo**:
- Click en el nodo → pestaña **"Output"** → ahí dice el error exacto
- Errores comunes:
  - `$http is not defined` → usaste `$http.request()` en vez de `fetch()`
  - `401 Unauthorized` → la SB_KEY es incorrecta
  - `Cannot read property 'id' of undefined` → la respuesta de Supabase no tiene datos
  - `ECONNREFUSED` → la URL de Supabase está mal
  - `Cannot read properties of undefined` → olvidaste `await response.json()`

---

## 🤖 Fase 4: Integración con el frontend (P3 + P2)

Cuando los workflows estén activos y probados:

### 4.1 Obtener la URL base

Cada workflow activo tiene una URL: `https://tunombre.app.n8n.cloud/webhook/<path>`
La base URL: `https://tunombre.app.n8n.cloud/webhook/`

P2 necesita actualizar `frontend/.env.local`:

```env
VITE_N8N_BASE_URL=https://tunombre.app.n8n.cloud/webhook
VITE_USE_MOCK=false
```

O en Netlify: **Site Settings → Environment Variables** (lo hace P5).

### 4.2 Probar integración completa

1. `npm run dev` en `frontend/`
2. Registrarse → debe crear usuario en Supabase vía n8n
3. Iniciar sesión → debe devolver token
4. Reportar mascota perdida → debe crear pet + lost_pet en Supabase
5. Ver el feed → debe traer posts de la DB

Si algo falla:
- **Browser DevTools → Network** → ver request que falló
- Copiar URL y probar directo en Postman
- Si Postman funciona pero frontend no → error en mapeo de datos
- Si Postman falla → error en el Code node de n8n

---

## 🧪 Fase 5: IA — Google Vision + Exa (P4)

### 5.1 Google Cloud Vision API

**Registro y API Key:**
1. Ir a https://console.cloud.google.com
2. Crear proyecto o usar uno existente
3. Habilitar **Cloud Vision API**
4. Ir a **Credentials** → **Create Credentials** → **API Key**
5. Copiar la key y guardarla como variable `GOOGLE_VISION_KEY` en **Settings → Variables**

**Endpoint:**
```
POST https://vision.googleapis.com/v1/images:annotate?key=GV_KEY
```

**Body:**
```json
{
  "requests": [{
    "image": { "source": { "imageUri": "https://ejemplo.com/foto.jpg" } },
    "features": [{ "type": "LABEL_DETECTION", "maxResults": 15 }]
  }]
}
```

**Response:**
```json
{
  "responses": [{
    "labelAnnotations": [
      { "description": "Dog", "score": 0.98 },
      { "description": "Beagle", "score": 0.92 },
      { "description": "Brown", "score": 0.78 }
    ]
  }]
}
```

**Probar Vision desde un workflow temporal:**

```javascript
const GV_KEY = $vars.GOOGLE_VISION_KEY;
const visionResponse = await fetch(
  `https://vision.googleapis.com/v1/images:annotate?key=${GV_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { source: { imageUri: 'https://i.imgur.com/ejemplo-perro.jpg' } },
        features: [{ type: 'LABEL_DETECTION', maxResults: 15 }]
      }]
    })
  }
);
return await visionResponse.json();
```

### 5.2 Exa.ai

**Registro:**
1. Ir a https://exa.ai
2. Crear cuenta
3. Ir a **API Keys** → crear una
4. Guardarla como variable `EXA_KEY` en **Settings → Variables**

### 5.3 Activar el flujo completo de IA

Cuando Google Vision esté probado:
1. Abrir el workflow `search-by-photo`
2. En el Code node, borrar la sección de mock
3. Asegurar que la variable `GOOGLE_VISION_KEY` tenga la API Key real
4. Ejecutar y verificar que devuelva `matchFound: true/false`

---

## ⚠️ Troubleshooting común

| Error | Causa | Solución |
|-------|-------|----------|
| `$http is not defined` | Usaste `$http.request()` en el Code node | Usar `fetch()` con `await response.json()` |
| "No data from previous node" | Code node no conectado al Webhook | Verificar la conexión en el canvas |
| "Cannot read properties of undefined" | Falta `await response.json()` o campo no existe | Revisar `res[0]?.campo` |
| "401 Unauthorized" | SB_KEY inválida | P5 verificar en Supabase → Settings → API |
| "ECONNREFUSED" | SB_URL mal escrita | Debe ser `https://xxx.supabase.co` (sin `/rest/`) |
| "Unused Respond to Webhook" | Pusiste un Respond to Webhook | Eliminarlo, usar Response Data: When Last Node Finishes |
| CORS error | n8n local sin configuración | n8n cloud lo maneja automático |

---

## 📌 Resumen visual de los 16 workflows

```
┌──────────────────────────────────────────────────────────────────────┐
│  n8n Dashboard                                                       │
│                                                                      │
│  🔴 Alta prioridad:                                                  │
│  [1]  get-lost-pets     [Webhook GET]  →  [Code: fetch + JOIN pets]  │
│  [2]  report-lost-pet   [Webhook POST] →  [Code: fetch CREATE pet]   │
│  [8]  login             [Webhook POST] →  [Code: fetch SELECT user]  │
│  [9]  register          [Webhook POST] →  [Code: fetch INSERT user]  │
│                                                                      │
│  🟡 Media prioridad:                                                 │
│  [4]  get-user-pets     [Webhook GET]  →  [Code: fetch SELECT pets]  │
│  [5]  save-pet          [Webhook POST] →  [Code: fetch INSERT pet]   │
│  [6]  get-posts         [Webhook GET]  →  [Code: fetch + JOIN pets]  │
│  [7]  create-post       [Webhook POST] →  [Code: fetch INSERT + count] │
│                                                                      │
│  🟢 Baja prioridad (nuevos del schema):                              │
│  [11] get-vaccines      [Webhook GET]  →  [Code: fetch vaccines]     │
│  [12] save-vaccine      [Webhook POST] →  [Code: fetch vaccine]      │
│  [13] get-vet-records   [Webhook GET]  →  [Code: fetch vet_records]  │
│  [14] save-vet-record   [Webhook POST] →  [Code: fetch vet_record]   │
│  [15] get-comments      [Webhook GET]  →  [Code: fetch + JOIN user]  │
│  [16] add-comment       [Webhook POST] →  [Code: fetch comment]      │
│                                                                      │
│  🟢 Baja (mantenido por compatibilidad):                             │
│  [3]  add-sighting      [Webhook POST] →  [Code: return { ok }]      │
│  [10] search-by-photo   [Webhook POST] →  [Code: fetch GV + SELECT]  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🏁 Entregables al finalizar

| Qué | Quién | Dónde queda |
|-----|-------|-------------|
| 16 workflows activos en n8n | P3 | n8n Cloud |
| Variables de n8n configuradas (GV, Exa, Supabase) | P4 | Settings → Variables |
| Base URL entregada a P2 | P3 | Chat del equipo |
| Prueba de integración hecha | P3 + P2 | Llamada de fetch exitosa |

**Nota:** Para activar el workflow `search-by-photo` (IA), P4 debe primero:
1. Obtener API Key de Google Cloud Vision
2. Probar el endpoint de Vision desde un workflow temporal
3. Ajustar la lista `razasConocidas` en el Code node si es necesario
4. Recién ahí activar el workflow
