-- ============================================================
-- PetConnect — Test / demo seed data
-- ============================================================
-- Owner: P5 (Data & DevOps).
-- Run AFTER schema.sql, only when you want demo data to test the
-- flows without waiting for the real Firecrawl dataset.
-- Values mirror frontend/src/data/mockData.js so the UI looks
-- identical whether it reads mocks or the real DB.
--
-- Safe to re-run: uses fixed UUIDs + ON CONFLICT DO NOTHING.
-- ============================================================


-- ── Users ────────────────────────────────────────────────
-- Demo password for all users is "test1234". Replace the hash
-- with a real bcrypt hash once P3 wires up auth in n8n.
INSERT INTO users (id, name, email, password_hash, location) VALUES
  ('11111111-0000-0000-0000-000000000001', 'María González', 'maria@email.com',  'hash_placeholder', 'San Salvador, El Salvador'),
  ('22222222-0000-0000-0000-000000000002', 'Carlos Ruiz',    'carlos@email.com', 'hash_placeholder', 'Santa Tecla, El Salvador')
ON CONFLICT (id) DO NOTHING;


-- ── Pets (with passport fields) ──────────────────────────
INSERT INTO pets
  (id, owner_id, name, breed, species, age, bio, sex, birth_date, color, weight_kg, sterilized, microchip_number, passport_number, country_of_origin, followers, posts_count)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'Max',   'Golden Retriever', 'Perro', '3 años', 'Le encanta nadar y perseguir pelotas.', 'Macho',  '2023-04-10', 'Dorado', 30.50, true,  '900123456789001', 'SV-PET-000001', 'El Salvador', 128, 24),
  ('aaaaaaaa-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002', 'Luna',  'Siamés',           'Gato',  '2 años', 'Curiosa y vocal. Duerme al sol.',       'Hembra', '2024-02-01', 'Crema',  4.20,  true,  '900123456789002', NULL,           'El Salvador', 89,  15),
  ('aaaaaaaa-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 'Rocky', 'Bulldog Francés',  'Perro', '4 años', 'Pequeño pero con mucha personalidad.',  'Macho',  '2022-06-15', 'Atigrado', 12.00, false, NULL,             NULL,           'El Salvador', 203, 31)
ON CONFLICT (id) DO NOTHING;


-- ── Vaccines (Max is fully travel-ready; Luna missing rabies) ──
INSERT INTO vaccines (id, pet_id, name, applied_date, next_due_date, veterinarian, clinic, batch_number, notes) VALUES
  ('cccccccc-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Rabia',               '2026-01-15', '2027-01-15', 'Dra. Ana López', 'Clínica VetSalva', 'RAB-2026-0451', 'Sin reacciones adversas.'),
  ('cccccccc-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Moquillo (Distemper)','2026-01-15', '2027-01-15', 'Dra. Ana López', 'Clínica VetSalva', 'MOQ-2026-0112', NULL),
  ('cccccccc-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Parvovirus',          '2026-01-15', '2027-01-15', 'Dra. Ana López', 'Clínica VetSalva', 'PAR-2026-0777', NULL),
  ('cccccccc-0000-0000-0000-000000000004', 'aaaaaaaa-0000-0000-0000-000000000003', 'Rabia',               '2025-11-01', '2026-11-01', 'Dr. José Mena',  'PetCare SS',       'RAB-2025-3390', NULL)
ON CONFLICT (id) DO NOTHING;


-- ── Vet records ──────────────────────────────────────────
INSERT INTO vet_records (id, pet_id, clinic_name, vet_name, phone, address, visit_date, reason, diagnosis, notes) VALUES
  ('dddddddd-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Clínica VetSalva', 'Dra. Ana López', '+503 2222-1111', 'Blvd. Los Héroes, San Salvador', '2026-01-15', 'Chequeo anual + vacunas', 'Saludable', 'Peso ideal, apto para viajar.'),
  ('dddddddd-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000003', 'PetCare SS',       'Dr. José Mena',  '+503 2233-4455', 'Santa Tecla',                    '2025-11-01', 'Vacuna antirrábica',      'Saludable', NULL)
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
