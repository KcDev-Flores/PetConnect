-- ============================================================
-- PetConnect — Test / demo seed data
-- ============================================================
-- Owner: P5 (Data & DevOps).
-- Run AFTER schema.sql. Optional: only to test with demo data.
-- Values mirror frontend/src/data/mockData.js.
-- Safe to re-run: fixed UUIDs + ON CONFLICT DO NOTHING.
--
-- NOTE: matches the current schema:
--   * no sightings / breeds tables (removed by the team)
--   * comments table
--   * lost_pets.pet_id is required, so every lost report links to
--     a real pet + owner.
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


-- ── Vaccines ─────────────────────────────────────────────
INSERT INTO vaccines (id, pet_id, name, applied_date, next_due_date, veterinarian, notes) VALUES
  ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Rabia',                '2026-01-15', '2027-01-15', 'Dra. Ana López', 'Sin reacciones adversas.'),
  ('cccccccc-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Moquillo (Distemper)', '2026-01-15', '2027-01-15', 'Dra. Ana López', NULL),
  ('cccccccc-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000002', 'Triple felina',        '2026-02-10', '2027-02-10', 'Dr. José Mena',  NULL),
  ('cccccccc-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000003', 'Rabia',                '2025-11-01', '2026-11-01', 'Dr. José Mena',  NULL)
ON CONFLICT (id) DO NOTHING;


-- ── Vet records ──────────────────────────────────────────
INSERT INTO vet_records (id, pet_id, clinic_name, vet_name, phone, visit_date, condition, notes) VALUES
  ('dddddddd-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Clínica VetSalva', 'Dra. Ana López', '+503 2222-1111', '2026-01-15', 'Sano',              'Chequeo anual, peso ideal.'),
  ('dddddddd-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'PetCare SS',       'Dr. José Mena',  '+503 2233-4455', '2026-02-10', 'Infección de oído', 'En tratamiento con gotas.')
ON CONFLICT (id) DO NOTHING;


-- ── Posts (social feed) ──────────────────────────────────
INSERT INTO posts (id, pet_id, content, likes, comments) VALUES
  ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '¡Primer día en la playa! Max no quería salir del agua 🌊', 42, 2),
  ('eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'Luna descubrió su nuevo rascador y ya es la reina del salón 👑', 67, 1),
  ('eeeeeeee-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'Paseo matutino por el parque. Rocky saludó a todos los perros del barrio 🦴', 31, 0),
  ('eeeeeeee-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', '¿Alguien conoce un buen veterinario cerca de Santa Tecla? Necesitamos chequeo anual.', 18, 0)
ON CONFLICT (id) DO NOTHING;


-- ── Comments (social feed comments) ──────────────────────
INSERT INTO comments (id, post_id, author_id, content) VALUES
  ('99999999-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000002', '¡Qué lindo! A Luna también le gusta el agua.'),
  ('99999999-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000003', 'Se ve que la pasó genial 🐶'),
  ('99999999-0000-0000-0000-000000000003', 'eeeeeeee-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000001', 'Jajaja toda una reina 👑')
ON CONFLICT (id) DO NOTHING;


-- ── Lost pets (emergency reports) ────────────────────────
-- pet_id links each report to the registered pet (required).
INSERT INTO lost_pets (id, pet_id, pet_name, breed, species, description, last_seen, last_seen_date, reward, owner_name, owner_phone) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000004', 'Toby',  'Beagle', 'Perro', 'Beagle tricolor, collar rojo con placa.',      'Colonia Escalón, San Salvador', '2026-07-03', '$50', 'Pedro Hernández', '+503 7123-4567'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000005', 'Michi', 'Persa',  'Gato',  'Gato persa blanco, ojos azules, sin collar.', 'Antiguo Cuscatlán',             '2026-07-02', NULL,  'Laura Vega',      '+503 7890-1234')
ON CONFLICT (id) DO NOTHING;
