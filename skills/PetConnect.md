# 🐾 Guía de Operaciones Hackathon: Ecosistema de Rescate Animal 🇸🇻

**Objetivo:** Construir una plataforma integral para el bienestar y la búsqueda inteligente de mascotas perdidas.
**El Secreto para Ganar:** No perderemos tiempo construyendo un backend tradicional (Express/Node). Nuestro "servidor" será una arquitectura orientada a eventos usando **n8n** como el cerebro que orquesta a las inteligencias artificiales. 

---

## 🏗️ La Arquitectura (Cómo se conecta todo)

Olvídate de la típica ruta `React -> Express -> MongoDB`. Nuestro flujo funciona así:

1. **Frontend (El Rostro):** React captura la foto y los datos.
2. **El Puente (La Conexión):** Zustand maneja los estados en el cliente y un simple `fetch` envía un JSON a una URL (Webhook).
3. **Backend Visual (El Cerebro):** n8n recibe ese JSON en su Webhook. No escribimos endpoints; conectamos nodos.
4. **La IA (El Superpoder):** n8n envía la foto a **Fal** (Visión) para saber qué animal es. Luego, n8n envía esos datos a **Exa** (Búsqueda Semántica) para buscar coincidencias en nuestra base de datos estructurada con **DataMCP**.
5. **Respuesta:** n8n devuelve un "¡Match Encontrado!" al Frontend.

---

## 👥 Roles y Responsabilidades Estrictas

### 🧑‍🎨 Persona 1: Desarrollador UI (El Constructor Visual)
* **Herramientas:** React, Cursor, Codex.
* **Enfoque:** Maquetar rápido y que se vea increíble. Cero lógica de negocio.
* **Misión:** Construir el Muro Social, el Formulario de Alerta y el Pasaporte Digital.
* **Atención Especial:** Para el Pasaporte Digital, dejarás preparado un contenedor limpio para React Three Fiber (R3F) para que el modelo 3D de la mascota pueda renderizarse sin romper el grid/flexbox de la aplicación en dispositivos móviles.

### 🧭 Persona 2: Integrador y Estado (El Navegador)
* **Herramientas:** React Router, Zustand, Flow, Zavu, Fetch/Axios.
* **Enfoque:** Darle vida a las vistas de la Persona 1.
* **Misión:** 1. Configurar las rutas con React Router basándose en la lógica visual creada en Flow.
    2. Usar Zustand para guardar la información del usuario logueado o la foto que acaba de subir.
    3. Integrar el asistente de emergencia Zavu en un rincón de la pantalla.
    4. Conectar los botones de "Enviar" a los webhooks de n8n.

### ⚙️ Persona 3: Arquitecto de Flujos (El Motor Backend)
* **Herramientas:** n8n, Base de Datos (Supabase o Firebase).
* **Enfoque:** Reemplazar el backend tradicional de Express con nodos visuales.
* **Misión:**
    1. Crear un flujo en n8n que empiece con un "Webhook". Esta URL es tu API, se la entregarás a la Persona 2.
    2. Conectar ese webhook a un nodo que inserte los datos en la Base de Datos.
    3. Asegurar que las respuestas (Response Node) devuelvan un status 200 al frontend.

### 🧠 Persona 4: Especialista IA y Matching (El Cerebro)
* **Herramientas:** Fal, Exa, DataMCP.
* **Enfoque:** La precisión. Si esta pieza funciona, ganamos.
* **Misión:** 1. Definir la estructura estandarizada de nuestros datos con DataMCP.
    2. Trabajar dentro del n8n de la Persona 3: Añadir un nodo que envíe la foto entrante a Fal para extraer raza y color.
    3. Conectar la salida de Fal hacia un nodo de Exa para buscar semánticamente esa descripción exacta en nuestra base de datos.

### 🕵️ Persona 5: Ingeniero de Datos y DevOps (El Recolector)
* **Herramientas:** Firecrawl, Cognition.
* **Enfoque:** Calidad y realismo. Una app vacía no impresiona.
* **Misión:**
    1. Usar Firecrawl para extraer reportes reales de mascotas perdidas/encontradas de sitios públicos locales (ej. directorios de clínicas o grupos comunitarios de zonas como Sonsonate o San Salvador) para poblar la base de datos de prueba.
    2. Desplegar agentes de Cognition en el repositorio para que revisen el código de React en tiempo real, arreglen problemas de dependencias o bugs de UI mientras las Personas 1 y 2 programan a toda velocidad.

---

## 🚀 Plan de Ejecución Lineal (Paso a Paso)

### Fase 1: Setup Independiente (Horas 1 - 4)
* **P1:** Inicia el repo en Cursor con Codex. Construye componentes tontos (sin lógica). Prepara el lienzo R3F para el pasaporte.
* **P2:** Esquematiza en Flow. Prepara el *store* de Zustand vacío.
* **P3:** Abre n8n, crea el Webhook POST y le pasa la URL a P2. Configura la base de datos vacía.
* **P4:** Genera API Keys de Fal y Exa. Define el esquema JSON en DataMCP.
* **P5:** Configura Firecrawl y empieza a descargar datos de mascotas salvadoreñas. Cognition empieza a auditar el repo vacío.

### Fase 2: Conexión Básica (Horas 5 - 12)
* **P1 & P2:** P2 toma los formularios de P1, envuelve los inputs en el estado de Zustand, y crea la función `fetch` que apunta a la URL de P3.
* **P3:** Recibe el primer JSON de prueba desde React. Lo inserta en la base de datos y devuelve un mensaje de éxito. Ya tenemos "backend".
* **P2:** Añade el widget de Zavu al index de la app.
* **P5:** Limpia los datos de Firecrawl y los inyecta en la base de datos de P3.

### Fase 3: La Magia de la IA (Horas 13 - 18)
* **P3 & P4 (Juntos en n8n):** Interceptan el flujo. Antes de que el webhook devuelva el éxito al usuario, envían la imagen a **Fal**. Fal responde: "Gato Siamés". Envían eso a **Exa**. Exa busca "Gato Siamés" en la DB y devuelve el ID del dueño.
* **P1 & P2:** Diseñan y conectan la vista Modal que dice *"¡Se ha encontrado un Match!"* basándose en la respuesta que ahora envía n8n.

### Fase 4: Pruebas y Bloqueo (Horas 19 - 24)
* **Todos:** *Feature Freeze* (nadie añade nada nuevo). 
* **Todos:** Simular perder un perro. P1 sube la foto en la UI -> P2 verifica Zustand -> P3 verifica que n8n reciba el golpe -> P4 asegura que Fal etiquete correctamente -> P5 confirma que no hay bugs.
* **Armar el Pitch:** Demostrar cómo una arquitectura *serverless* basada en agentes (n8n + IA) resuelve emergencias en minutos.

---
**Nota de Créditos:** Hagan un *mock* de las respuestas de Fal y Exa durante las horas 1 a la 18. Activen las llamadas reales a la API de IA solo en la Fase 4 para no agotar los fondos del equipo antes de la presentación. ¡A codear!

---
---

# 🧩 FASE 2 — Guía Especializada: Personas 3, 4 y 5

> Esta sección responde la pregunta clave del equipo: **¿Podemos usar n8n como "backend" si el frontend va en Netlify?** La respuesta es **sí, y es la mejor decisión posible para un hackathon.** Aquí está exactamente cómo funciona y qué debe hacer cada quien.

---

## 🤔 ¿Por qué n8n funciona perfecto con Netlify?

Netlify solo sirve archivos estáticos (HTML, JS, CSS). Eso significa que **no puede correr código de servidor** como Express o Node. Entonces necesitamos un "backend" que viva en otro lugar — y n8n es exactamente eso.

**El flujo real es:**

```
[Netlify - React App]  ──fetch(POST)──▶  [n8n Cloud - Webhook URL]
                                                    │
                                          Procesa la lógica
                                          Guarda en Supabase
                                          Llama a Fal / Exa
                                                    │
                                         ◀─────── Responde JSON ────────
```

React en Netlify hace un `fetch` a una URL pública de n8n. n8n recibe el request, ejecuta los nodos (lógica, base de datos, IA), y regresa la respuesta. **Para React, es exactamente igual que llamar a una API Express — solo que tú no escribiste una sola línea de servidor.**

---

## ⚙️ PERSONA 3 — Guía Paso a Paso: n8n como Backend

### Paso 0: Dónde corre n8n
Usa **n8n Cloud** (https://n8n.io) — tiene plan gratuito. NO instales nada local. Crea una cuenta y ya tienes tu servidor corriendo en internet con URL pública.

### Paso 1: Crear tu primer flujo (el más importante)

En n8n, un "flujo" es una cadena de nodos. Este es el flujo para recibir una alerta de mascota perdida:

```
[Webhook] ──▶ [Set Fields] ──▶ [Supabase: Insert Row] ──▶ [Respond to Webhook]
```

**Nodo 1 — Webhook:**
- Tipo: `Webhook`
- Method: `POST`
- Path: `report-lost-pet` (tú eliges)
- Cuando lo actives, n8n te da una URL como: `https://tuapp.n8n.io/webhook/report-lost-pet`
- **Esa URL es tu API. Se la pasas a la Persona 2.**

**Nodo 2 — Set Fields (opcional pero recomendado):**
- Tipo: `Set`
- Sirve para limpiar/renombrar los campos que llegan del frontend antes de guardar.
- Ejemplo: renombrar `petName` → `pet_name` para que coincida con tu tabla en Supabase.

**Nodo 3 — Supabase: Insert Row:**
- Tipo: `Supabase`
- Operation: `Insert`
- Table: `lost_pets`
- Conecta tus credenciales de Supabase (URL + anon key).

**Nodo 4 — Respond to Webhook:**
- Tipo: `Respond to Webhook`
- Response Code: `200`
- Response Body: `{ "status": "ok", "message": "Reporte recibido" }`
- **Este nodo cierra el ciclo. Sin él, el fetch de React se queda esperando.**

### Paso 2: Testear el flujo sin el frontend

Antes de pedirle nada a la Persona 2, prueba tu webhook tú mismo con este comando en terminal:

```bash
curl -X POST https://tuapp.n8n.io/webhook/report-lost-pet \
  -H "Content-Type: application/json" \
  -d '{"petName": "Firulais", "breed": "Labrador", "lastSeen": "Sonsonate"}'
```

Si ves `{ "status": "ok" }` — tu backend funciona. Avísale a P2 la URL.

### Paso 3: Configurar Supabase

1. Ve a https://supabase.com y crea un proyecto.
2. En el editor SQL, crea esta tabla:

```sql
CREATE TABLE lost_pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name TEXT NOT NULL,
  breed TEXT,
  species TEXT,
  last_seen TEXT,
  description TEXT,
  owner_phone TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

3. Ve a Settings → API y copia: **Project URL** y **anon public key**.
4. En n8n, agrega una credencial de Supabase con esos datos.

### Paso 4: Habilitar CORS (crítico para Netlify)

Cuando React en Netlify haga el fetch a tu webhook de n8n, el navegador verificará que n8n permita requests desde otro dominio. En n8n Cloud esto ya está habilitado por defecto — no necesitas hacer nada extra. Si usas n8n self-hosted, activa `N8N_CORS_ENABLE=true`.

### Tus flujos a crear (lista completa):

| Flujo | Webhook Path | Qué hace |
|---|---|---|
| Reportar mascota perdida | `/report-lost-pet` | Guarda reporte en Supabase |
| Obtener alertas activas | `/get-lost-pets` | Lee y devuelve lista desde Supabase |
| Reportar avistamiento | `/add-sighting` | Añade avistamiento a un reporte |
| Buscar mascota (IA) | `/search-by-photo` | Llama a Fal + Exa (P4 lo completa) |

---

## 🧠 PERSONA 4 — Guía Paso a Paso: Integrar IA en los flujos de n8n

> Tu trabajo vive **dentro del n8n de la Persona 3**. No construyes nada por separado. Tú extiendes los flujos que ella ya hizo.

### Paso 1: Entender el flujo que vas a extender

El flujo `/search-by-photo` de P3 llega vacío esperándote. Su estructura actual:

```
[Webhook] ──▶ [Respond to Webhook] ← aquí está el hueco que tú llenas
```

Tú lo convertirás en:

```
[Webhook] ──▶ [HTTP Request → Fal] ──▶ [HTTP Request → Exa] ──▶ [Supabase: Select] ──▶ [Respond to Webhook]
```

### Paso 2: Nodo de Fal (Visión por Computadora)

Fal analiza la imagen y devuelve: raza, color, especie, tamaño.

- Tipo de nodo: `HTTP Request`
- Method: `POST`
- URL: `https://fal.run/fal-ai/image-captioning` (o el endpoint de visión que elijas)
- Headers: `Authorization: Key TU_FAL_KEY`
- Body (JSON):
```json
{
  "image_url": "{{ $json.photoUrl }}"
}
```
- La respuesta de Fal tendrá algo como: `{ "caption": "Golden Retriever macho, color dorado, mediano" }`

### Paso 3: Nodo de Exa (Búsqueda Semántica)

Con la descripción de Fal, Exa busca en nuestra base de datos de mascotas perdidas.

- Tipo de nodo: `HTTP Request`
- Method: `POST`
- URL: `https://api.exa.ai/search`
- Headers: `x-api-key: TU_EXA_KEY`
- Body (JSON):
```json
{
  "query": "{{ $json.caption }}",
  "numResults": 5,
  "type": "neural"
}
```

> **Nota:** Exa busca en internet por defecto. Para buscar en TU base de datos, necesitas usar la opción `contents` de Exa o complementar con un nodo de Supabase que haga búsqueda por texto. Habla con P3 para decidir si el match lo hace Exa o una query SQL con `ILIKE`.

### Paso 4: Definir el esquema JSON con DataMCP

DataMCP te permite definir la estructura exacta de los datos que fluyen entre nodos. Crea este esquema y compártelo con P3 y P2 para que todos envíen y reciban el mismo formato:

```json
{
  "type": "object",
  "properties": {
    "petName":     { "type": "string", "description": "Nombre de la mascota" },
    "breed":       { "type": "string", "description": "Raza identificada" },
    "species":     { "type": "string", "enum": ["Perro", "Gato", "Otro"] },
    "color":       { "type": "string", "description": "Color principal del pelaje" },
    "size":        { "type": "string", "enum": ["Pequeño", "Mediano", "Grande"] },
    "photoUrl":    { "type": "string", "format": "uri" },
    "lastSeen":    { "type": "string", "description": "Lugar donde fue visto por última vez" },
    "ownerPhone":  { "type": "string" },
    "description": { "type": "string" }
  },
  "required": ["petName", "species", "photoUrl", "ownerPhone"]
}
```

### Paso 5: Respuesta de Match al Frontend

El nodo final `Respond to Webhook` debe devolver este JSON cuando hay match:

```json
{
  "matchFound": true,
  "pet": {
    "id": "uuid-aqui",
    "petName": "Firulais",
    "breed": "Golden Retriever",
    "ownerPhone": "+503 7777-0000",
    "confidence": 0.92
  }
}
```

Y si no hay match:
```json
{ "matchFound": false }
```

La Persona 2 conectará su modal de "¡Match encontrado!" a este campo `matchFound`.

---

## 🕵️ PERSONA 5 — Guía Paso a Paso: Datos y DevOps

### Paso 1: Poblar la base de datos con Firecrawl

Firecrawl extrae texto estructurado de páginas web. Úsalo para raspar grupos o páginas de mascotas perdidas en El Salvador.

```javascript
// Ejemplo de uso de Firecrawl SDK
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: 'TU_FIRECRAWL_KEY' });

const result = await app.scrapeUrl('https://www.facebook.com/groups/mascotasperdidassv', {
  formats: ['markdown'],
  onlyMainContent: true,
});

console.log(result.markdown); // texto con los reportes
```

Después procesas ese texto y lo conviertes al esquema de P4 para insertarlo en Supabase.

### Paso 2: Entregar datos limpios a P3

El formato que le entregas a P3 para inserción masiva:

```json
[
  {
    "pet_name": "Luna",
    "breed": "Chihuahua",
    "species": "Perro",
    "last_seen": "Col. Escalón, San Salvador",
    "description": "Chihuahua blanca con manchas negras, collar rosado",
    "owner_phone": "+503 7234-5678",
    "photo_url": "https://...",
    "created_at": "2025-07-01T10:00:00Z"
  }
]
```

### Paso 3: Configurar Cognition para auditar el repo

Cognition actúa como un revisor de código en tiempo real. Configúralo apuntando al repositorio de GitHub para que:
1. Detecte imports rotos o componentes sin exportar (errores frecuentes de P1 trabajando rápido).
2. Alerte si un `fetch` en el código de P2 apunta a una URL de localhost en vez de la URL real de n8n.
3. Avise si hay dependencias instaladas pero sin usar.

### Paso 4: Preparar el deploy en Netlify (tu responsabilidad)

Eres quien conecta el repo a Netlify. Pasos:

1. Ve a https://netlify.com → "Add new site" → "Import from Git".
2. Elige el repositorio de GitHub del equipo.
3. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. En **Environment Variables** de Netlify, añade:
   - `VITE_N8N_BASE_URL` = `https://tuapp.n8n.io/webhook`
5. Cada push a `main` dispara un deploy automático.

> **Importante para P2:** Todos los fetch deben usar `import.meta.env.VITE_N8N_BASE_URL` en vez de la URL hardcodeada. Así el mismo código funciona en local y en Netlify.

---

## 🤝 Cómo colaboran las Personas 3, 4 y 5 con las Personas 1 y 2

```
P1 (UI) ──entrega componentes──▶ P2 (Integrador)
                                       │
                              conecta fetch a URL de:
                                       │
                                       ▼
                              P3 (n8n Webhook)
                                       │
                              extiende flujo con:
                                       │
                                       ▼
                              P4 (Fal + Exa en n8n)
                                       │
                              datos de prueba de:
                                       │
                                       ▼
                              P5 (Firecrawl → Supabase)
                                       │
                              deploy en Netlify por:
                                       │
                                       ▼
                              P5 (Netlify + Cognition)
```

**Puntos de entrega concretos:**

| Quien entrega | Qué entrega | A quien | Cuándo |
|---|---|---|---|
| **P3** | URL del webhook `/report-lost-pet` | **P2** | Hora 3 |
| **P3** | URL del webhook `/get-lost-pets` | **P2** | Hora 3 |
| **P4** | Esquema JSON de DataMCP | **P2 y P3** | Hora 2 |
| **P4** | Nodo de Fal funcionando en n8n | **P3** | Hora 8 |
| **P5** | Archivo JSON con datos de prueba | **P3** | Hora 5 |
| **P5** | URL de Netlify con el deploy | **Todos** | Hora 6 |
| **P3** | URL del webhook `/search-by-photo` | **P2** | Hora 13 |

---

## ⚠️ Errores comunes a evitar

| Error | Consecuencia | Solución |
|---|---|---|
| P3 no activa el "Respond to Webhook" | React se queda colgado esperando | Siempre terminar el flujo con ese nodo |
| P2 hardcodea la URL de n8n | Funciona local, falla en Netlify | Usar `import.meta.env.VITE_N8N_BASE_URL` |
| P4 activa llamadas reales a Fal desde el inicio | Se acaban los créditos en horas | Usar mock data hasta la Fase 4 |
| P5 no configura CORS en Supabase | P3 no puede insertar desde n8n | Habilitar RLS policies en Supabase correctamente |
| P3 usa el webhook en modo "Test" | La URL de test deja de funcionar al cerrar n8n | Activar el flujo en modo "Production" |