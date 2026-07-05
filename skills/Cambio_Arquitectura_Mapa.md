# 🗺️ Cambio de Arquitectura: Nuevo Mapa y Eliminación de Avistamientos

## 📌 Contexto de la Decisión
Se ha decidido eliminar la funcionalidad de "Reportar Avistamiento" por parte de la comunidad. 
**Motivo:** Permitir avistamientos libres puede generar falsas expectativas a los dueños si la herramienta se usa de mala fe o con información incorrecta.

### El Nuevo Flujo:
1. Al momento de reportar una mascota perdida, el **dueño** no escribirá la ubicación, sino que **seleccionará un punto exacto en un mapa interactivo**.
2. En la pantalla de Emergencias, el mapa solo mostrará ese **único punto** (la última ubicación donde el dueño lo vio).
3. Si alguien encuentra o ve a la mascota, simplemente usará el botón de **"Contactar dueño"** para hablar directamente con él.

> 💡 **Recomendación técnica sobre el Mapa:**
> Aunque Google Maps es la opción más conocida, requiere configurar facturación con tarjeta de crédito para obtener el API Key. En un Hackathon, esto suele dar dolores de cabeza.
> **Se recomienda usar `react-leaflet` (Leaflet) con `OpenStreetMap`** o **Mapbox**. Son gratuitos, fáciles de implementar en React y no requieren tarjetas de crédito.

---

## 🛠️ Tareas por Persona (Paso a Paso)

### 🧑‍🎨 Persona 1 (UI/UX - Grillo)
Tu objetivo es modificar la interfaz para reflejar el nuevo flujo más limpio.

1. **En `AlertForm.jsx`:**
   - Elimina el `input` de texto de "Última vez visto".
   - Agrega un componente de Mapa interactivo (ej. con Leaflet).
   - Configura el mapa para que, al hacer clic, ponga un pin y guarde las coordenadas (`lat` y `lng`) en el estado del formulario.
2. **En `Emergency.jsx`:**
   - Elimina el botón "Reportar avistamiento".
   - Elimina el formulario que se abría para escribir comentarios y ubicaciones de avistamientos.
   - Elimina la lista de avistamientos (los cuadritos con los comentarios de la gente).
   - Elimina el recuadro amarillo de "Triangulación estimada".
3. **En `SightingMap.jsx`:**
   - Renómbralo a `LastSeenMap.jsx` (opcional, por limpieza).
   - Ahora el componente debe recibir solo un par de coordenadas (`lat` y `lng`) en lugar de un array de avistamientos.
   - Debe mostrar el mapa centrado en ese único punto con un pin rojo.

### 🧑‍💻 Persona 2 (Frontend Lógica - Chaper)
Tu objetivo es adaptar los estados locales, mock data y la capa de conexión.

1. **En `mockData.js`:**
   - Elimina la función `estimateLocation`.
   - A cada objeto en `lostReports`, elimínale el array `sightings: []`.
   - A cada objeto en `lostReports`, agrégale `lat` y `lng` (coordenadas de prueba).
2. **En `api.js` y `useLostPets.js`:**
   - Elimina la función `addSighting` (y `submitSighting` del hook).
   - Actualiza el payload de `reportLostPet` para que envíe `lat` y `lng` en lugar del string de texto de la ubicación.
   - Asegúrate de que `getLostPets` devuelva los reportes con sus nuevas coordenadas.

### 🗄️ Persona 5 (Base de Datos - Supabase)
Tu objetivo es actualizar el esquema SQL antes de que P3 cree sus flujos.

1. **Borrar tabla:**
   - Ejecuta `DROP TABLE sightings;` (ya no existirá).
2. **Modificar `lost_pets`:**
   - Elimina la columna `last_seen` (texto).
   - Agrega las columnas de coordenadas ejecutando esto:
     ```sql
     ALTER TABLE lost_pets DROP COLUMN last_seen;
     ALTER TABLE lost_pets ADD COLUMN lat FLOAT;
     ALTER TABLE lost_pets ADD COLUMN lng FLOAT;
     ```

### ⚙️ Persona 3 (Backend - n8n)
Tu objetivo es simplificar los webhooks basados en el nuevo modelo de la base de datos.

1. **Flujo `/add-sighting`:**
   - **Eliminar por completo.** Este webhook ya no se usará.
2. **Flujo `/report-lost-pet`:**
   - Actualizar el nodo de *Supabase Insert*.
   - Ahora debe mapear `{{ $json.body.lat }}` y `{{ $json.body.lng }}` hacia las nuevas columnas en Supabase, ignorando el antiguo campo de texto.
3. **Flujo `/get-lost-pets`:**
   - Simplificar el flujo. Ya no hay que hacer cruces (JOINs) ni dobles peticiones para buscar los "sightings" asociados. Con un simple *Select de Supabase* a `lost_pets` será suficiente.

### 🤖 Persona 4 (Agentes IA - DataMCP)
Tu objetivo es muy simple en este caso:

1. **Tener en cuenta:**
   - Si tenías planeado usar los "avistamientos" (sightings) para que algún Agente de IA analizara rutas de la mascota, debes ajustar ese plan.
   - Fal AI (búsqueda por foto) sigue funcionando exactamente igual (esto no afecta el reconocimiento de imágenes).
