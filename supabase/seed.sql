-- ============================================================
-- PetConnect — Test / demo seed data
-- ============================================================
-- Owner: P5 (Data & DevOps).
-- Run AFTER schema.sql. Optional: only to test with demo data.
-- Values mirror frontend/src/data/mockData.js.
-- Safe to re-run: fixed UUIDs + ON CONFLICT DO NOTHING.
--
-- NOTE: matches the current schema:
--   * no sightings / breeds / vaccines / vet_records / comments
--     tables (removed for the MVP)
--   * lost_pets.pet_id is optional; pet_name/breed/species are
--     stored directly on the report.
-- ============================================================


-- ── Users ────────────────────────────────────────────────
-- Demo password is "test1234"; replace the hash once auth is wired.
INSERT INTO users (id, name, email, password_hash, location) VALUES
  ('11111111-0000-0000-0000-000000000001', 'María González',  'maria@email.com',  'hash_placeholder', 'San Salvador, El Salvador'),
  ('22222222-0000-0000-0000-000000000002', 'Carlos Ruiz',     'carlos@email.com', 'hash_placeholder', 'Santa Tecla, El Salvador'),
  ('33333333-0000-0000-0000-000000000003', 'Pedro Hernández', 'pedro@email.com',  'hash_placeholder', 'San Salvador, El Salvador'),
  ('44444444-0000-0000-0000-000000000004', 'Laura Vega',      'laura@email.com',  'hash_placeholder', 'Antiguo Cuscatlán, El Salvador')
ON CONFLICT (id) DO NOTHING;


-- ── Pets ─────────────────────────────────────────────────
-- Every user has at least one pet profile (Toby / Michi belong to
-- the owners of the lost reports below).
INSERT INTO pets (id, owner_id, name, breed, species, age, sex, color, weight, bio, followers, posts_count) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Max',   'Golden Retriever', 'Perro', '3 años', 'Macho',  'Dorado',    '30 kg', 'Le encanta nadar y perseguir pelotas.', 128, 24),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Luna',  'Siamés',           'Gato',  '2 años', 'Hembra', 'Crema',     '4 kg',  'Curiosa y vocal. Duerme al sol.',       89,  15),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Rocky', 'Bulldog Francés',  'Perro', '4 años', 'Macho',  'Atigrado',  '12 kg', 'Pequeño pero con mucha personalidad.',  203, 31),
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000003', 'Toby',  'Beagle',           'Perro', '2 años', 'Macho',  'Tricolor',  '10 kg', 'Beagle juguetón, collar rojo con placa.',  12, 2),
  ('aaaaaaaa-0000-0000-0000-000000000005', '44444444-0000-0000-0000-000000000004', 'Michi', 'Persa',            'Gato',  '3 años', 'Hembra', 'Blanco',    '5 kg',  'Gato persa blanco, ojos azules.',          8,  1)
ON CONFLICT (id) DO NOTHING;


-- ── Posts (social feed) ──────────────────────────────────
INSERT INTO posts (id, pet_id, content, likes, comments) VALUES
  ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '¡Primer día en la playa! Max no quería salir del agua 🌊', 42, 2),
  ('eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'Luna descubrió su nuevo rascador y ya es la reina del salón 👑', 67, 1),
  ('eeeeeeee-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'Paseo matutino por el parque. Rocky saludó a todos los perros del barrio 🦴', 31, 0),
  ('eeeeeeee-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', '¿Alguien conoce un buen veterinario cerca de Santa Tecla? Necesitamos chequeo anual.', 18, 0)
ON CONFLICT (id) DO NOTHING;


-- ── Lost pets (emergency reports) ────────────────────────
-- pet_id is optional (Toby/Michi are registered; the stray dog is not).
-- Toby shares location (lat/lng set) -> shows a map pin.
-- Michi does NOT share location (lat/lng NULL) -> text only.
INSERT INTO lost_pets (id, pet_id, pet_name, breed, species, description, last_seen, last_seen_lat, last_seen_lng, last_seen_date, reward, owner_name, owner_phone) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000004', 'Toby',        'Beagle', 'Perro', 'Beagle tricolor, collar rojo con placa.',         'Colonia Escalón, San Salvador', 13.700800, -89.240900, '2026-07-03', '$50', 'Pedro Hernández', '+503 7123-4567'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000005', 'Michi',       'Persa',  'Gato',  'Gato persa blanco, ojos azules, sin collar.',     'Antiguo Cuscatlán',             NULL,       NULL,        '2026-07-02', NULL,  'Laura Vega',      '+503 7890-1234'),
  ('bbbbbbbb-0000-0000-0000-000000000003', NULL,                                   'Desconocido', NULL,     'Perro', 'Perro callejero café, sin collar, muy asustado.', 'Bulevar de Los Héroes',          NULL,       NULL,        '2026-07-04', NULL,  'Anónimo',          '+503 7000-0000')
ON CONFLICT (id) DO NOTHING;
