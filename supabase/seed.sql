-- ============================================================
-- PetConnect — Test / demo seed data
-- ============================================================
-- Owner: P5 (Data & DevOps).
-- Run AFTER schema.sql. Optional: only to test with demo data.
-- Values mirror frontend/src/data/mockData.js.
-- Safe to re-run: fixed UUIDs + ON CONFLICT DO NOTHING.
-- ============================================================


-- ── Users ────────────────────────────────────────────────
-- Demo password is "test1234"; replace the hash once auth is wired.
INSERT INTO users (id, name, email, password_hash, location) VALUES
  ('11111111-0000-0000-0000-000000000001', 'María González', 'maria@email.com',  'hash_placeholder', 'San Salvador, El Salvador'),
  ('22222222-0000-0000-0000-000000000002', 'Carlos Ruiz',    'carlos@email.com', 'hash_placeholder', 'Santa Tecla, El Salvador')
ON CONFLICT (id) DO NOTHING;


-- ── Pets ─────────────────────────────────────────────────
INSERT INTO pets (id, owner_id, name, breed, species, age, sex, color, weight, bio, followers, posts_count) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Max',   'Golden Retriever', 'Perro', '3 años', 'Macho',  'Dorado',   '30 kg', 'Le encanta nadar y perseguir pelotas.', 128, 24),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Luna',  'Siamés',           'Gato',  '2 años', 'Hembra', 'Crema',    '4 kg',  'Curiosa y vocal. Duerme al sol.',       89,  15),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Rocky', 'Bulldog Francés',  'Perro', '4 años', 'Macho',  'Atigrado', '12 kg', 'Pequeño pero con mucha personalidad.',  203, 31)
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
  ('eeeeeeee-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '¡Primer día en la playa! Max no quería salir del agua 🌊', 42, 8),
  ('eeeeeeee-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000002', 'Luna descubrió su nuevo rascador y ya es la reina del salón 👑', 67, 12),
  ('eeeeeeee-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000003', 'Paseo matutino por el parque. Rocky saludó a todos los perros del barrio 🦴', 31, 5),
  ('eeeeeeee-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000001', '¿Alguien conoce un buen veterinario cerca de Santa Tecla? Necesitamos chequeo anual.', 18, 14)
ON CONFLICT (id) DO NOTHING;


-- ── Lost pets (emergency reports) ────────────────────────
INSERT INTO lost_pets (id, pet_name, breed, species, description, last_seen, last_seen_date, reward, owner_name, owner_phone) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Toby',  'Beagle', 'Perro', 'Beagle tricolor, collar rojo con placa.',      'Colonia Escalón, San Salvador', '2026-07-03', '$50', 'Pedro Hernández', '+503 7123-4567'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Michi', 'Persa',  'Gato',  'Gato persa blanco, ojos azules, sin collar.', 'Antiguo Cuscatlán',             '2026-07-02', NULL,  'Laura Vega',      '+503 7890-1234')
ON CONFLICT (id) DO NOTHING;


-- ── Sightings ────────────────────────────────────────────
INSERT INTO sightings (id, report_id, comment, location, lat, lng, author, confidence) VALUES
  ('ffffffff-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Lo vi cruzando la calle cerca del parque', 'Parque Escalón',                35, 45, 'Lucía M.', 0.9),
  ('ffffffff-0000-0000-0000-000000000002', 'bbbbbbbb-0000-0000-0000-000000000001', 'Escuché ladridos en esa zona anoche',      'Zona residencial',              55, 38, 'Jorge P.', 0.6),
  ('ffffffff-0000-0000-0000-000000000003', 'bbbbbbbb-0000-0000-0000-000000000001', 'Vi un beagle similar en la panadería',     'Panadería Escalón',             42, 62, 'Sofía R.', 0.75),
  ('ffffffff-0000-0000-0000-000000000004', 'bbbbbbbb-0000-0000-0000-000000000002', 'Gato blanco en el techo de una casa',      'Antiguo Cuscatlán residencial', 30, 70, 'Diego S.', 0.85)
ON CONFLICT (id) DO NOTHING;
