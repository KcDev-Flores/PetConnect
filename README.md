# PetConnect — Documentación 

## Idea del proyecto

Plataforma social interactiva y cuidado de mascotas, una web con diferentes navegaciones donde puedes publicar y compartir bellos recuerdos con tu amigo cercano.

## Documentacion tecnica

### 🎨 Frontend

frontend/src/
├── components/   # UI reutilizable (cards, feed, emergency, layout, ui, forms, icons)
├── pages/        # Feed, Emergency, Search, Passport, Profile, Login
├── hooks/        # useAuth, useFeed, useLostPets, usePets, useProfile, useSearch
├── store/        # authStore (Zustand)
├── lib/          # cliente de Supabase
├── services/     # api.js (webhooks de n8n + modo mock)
├── router/       # AppRouter (rutas públicas/privadas)
├── layouts/      # MainLayout (navbar, sidebar, panel derecho)
└── data/         # datos mock de desarrollo

### ⚙️ Backend (n8n)

El backend de datos está construido con n8n, una plataforma de automatización de workflows. Cada endpoint es un webhook que recibe la petición del frontend, ejecuta su workflow (validación, lógica de negocio) y lee/escribe en Supabase (PostgreSQL). El frontend incluye el JWT de Supabase Auth en las cabeceras (Authorization: Bearer <token>) en las peticiones que requieren sesión.

Base URL: https://nayelsmadai.app.n8n.cloud/webhook

## Sponsors

### 🤖 Devin (Cognition) — Agente de IA
Devin trabajó como el ingeniero de P5: diseñó y escribió el schema y los seeds, implementó la autenticación con Supabase Auth + Zustand en el frontend, probó el login de punta a punta (con grabación como evidencia), generó los scripts de migración y documentó el contrato de datos. Cada cambio se entregó como Pull Request revisable, trabajando de forma iterativa con el equipo humano: nosotros decidíamos la arquitectura y Devin la ejecutaba, explicando cada decisión técnica en el camino.

### 🗄️ Supabase — Base de datos y autenticación
El backend de datos del proyecto: PostgreSQL gestionado donde viven todas las tablas, y **Supabase Auth** como sistema de autenticación (hash de contraseñas, JWT, sesiones). También usamos su SQL Editor para ejecutar schema, seeds y migraciones, y el Table Editor y los Logs para verificar los datos que n8n insertaba.

### 🔌 DataMCP — La base de datos conversando con la IA
Conectamos Supabase a **DataMCP** (vía el connection pooler de PostgreSQL), exponiendo la base como servidor **MCP** (Model Context Protocol). Esto permite que agentes de IA (Cursor, Claude, etc.) consulten la base en lenguaje natural — "¿cuántas mascotas perdidas activas hay?" — sin escribir SQL, ideal para inspeccionar datos, depurar y generar reportes durante el desarrollo.

### 🐙 GitHub — Colaboración y control de versiones
Todo el trabajo vive en el repositorio del equipo. Cada aporte de P5 se entregó como Pull Request hacia la rama principal de desarrollo, con descripciones detalladas y revisión automática de código (**Devin Review**) en cada PR, permitiendo que el resto del equipo integrara los cambios con un simple merge + pull.

### 🎙️ Wispr Flow — Dictado por voz con IA
Usamos Wispr Flow como herramienta de productividad durante el desarrollo: dictado por voz con IA que convierte lo hablado en texto limpio y bien formateado en cualquier aplicación. Nos permitió redactar instrucciones, prompts y comunicación del equipo mucho más rápido que escribiendo, agilizando la coordinación entre los organizadores y las iteraciones con el agente de IA.

### Cursor y Codex — Desarrollo asistido
Codex fue el entorno principal de desarrollo para construir y organizar el frontend en React + Vite. Se utilizó como asistente técnico para acelerar la implementación de componentes, páginas, hooks y la capa de servicios (`api.js`), además de apoyar en refactors, validación de contratos de datos y resolución de errores durante la integración con n8n. En la práctica, el equipo definía la arquitectura y decisiones funcionales, y Codex ayudaba a traducirlas rápidamente a código mantenible, reduciendo tiempos de iteración y facilitando la entrega de funcionalidades. Cursor nos ayudo a estudiar y darnos asistencias de las nuevas tecnologias que no habiamos usado y que esta vez tuvimos la oportunidad.

### Video de la Pagina 
https://youtu.be/tQyzBDEg5K0
