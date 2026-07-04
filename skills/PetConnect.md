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