# Resumen de apoyo en PetConnect

He ayudado a convertir PetConnect en una experiencia mas completa para un ecosistema de mascotas: perfiles de dueno y mascotas, pasaporte digital, emergencias, feed social, historias y busqueda.

## Cambios principales

- Perfil del dueno: edicion de datos, foto, contacto, residencia, agregar y eliminar mascotas.
- Mascotas: pasaporte digital editable, foto, datos veterinarios, documentos de viaje y estado perdido/encontrado.
- Emergencias: publicaciones de mascotas perdidas con ubicacion, contacto por WhatsApp, foto, detalle por card y marcar como encontrado.
- Feed: estilo Instagram con publicaciones, foto, descripcion, ubicacion, likes, comentarios y selector de mascota autora.
- Historias: subida por 24 horas, selector de perfil, agrupacion por mascota, visor con progreso de 7 segundos, vistas y navegacion entre perfiles.
- Buscar: cards mas pequenas, seguimiento de perfiles y vista de informacion completa.
- UI responsive: navbar con menu hamburguesa para movil.

## Como se hizo

Se trabajo principalmente con React, estados locales y `localStorage` para simular persistencia sin backend completo. Se ajustaron componentes, hooks y paginas para conectar formularios, cards, modales, filtros, acciones y datos entre Feed, Perfil, Pasaporte, Emergencia y Buscar.
