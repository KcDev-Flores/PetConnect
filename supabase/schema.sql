-- ============================================================
-- PetConnect — Database schema (Supabase / PostgreSQL)
-- ============================================================
-- Owner: P5 (Data & DevOps). This is the DATA CONTRACT that P3
-- consumes from n8n. Run this whole file in the Supabase SQL
-- Editor (Database -> SQL Editor -> New Query) in order.
--
-- Conventions:
--   * Table and column names are in ENGLISH.
--   * Enum VALUES are kept in Spanish ('Perro', 'Gato', 'activo', ...)
--     on purpose, because the frontend (P1/P2) already uses those
--     exact strings in mockData.js. Do NOT translate them or the UI
--     breaks.
--   * Every table uses UUID primary keys (except reference catalogs).
--
-- Sections:
--   1. Extensions
--   2. Helper: updated_at trigger
--   3. users
--   4. pets            (digital passport core)
--   5. vaccine_catalog (reference: common vaccines)
--   6. vaccines        (per-pet vaccination records)
--   7. vet_records     (per-pet veterinary visits)
--   8. posts           (social feed)
--   9. lost_pets       (emergency reports)
--  10. sightings       (lost pet sightings)
--  11. breeds          (reference catalog)
--  12. pet_travel_status (view: travel readiness)
--  13. indexes
-- ============================================================


-- ============================================================
-- 1. EXTENSIONS (UUID generation)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 2. HELPER — keep updated_at fresh automatically
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 3. TABLE: users (registered owners)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,            -- never exposed to the frontend
  avatar_url    TEXT,
  location      TEXT DEFAULT 'El Salvador',
  joined_at     TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 4. TABLE: pets (registered pets / DIGITAL PASSPORT)
-- ------------------------------------------------------------
-- The passport treats a pet like a traveler: identity fields,
-- microchip, and an official passport number for cross-border
-- travel. Vaccines and vet visits live in their own tables.
-- ============================================================
CREATE TABLE IF NOT EXISTS pets (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  breed             TEXT,
  species           TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')) DEFAULT 'Perro',
  age               TEXT,                 -- human label, e.g. "3 años", "8 meses"
  bio               TEXT,
  photo_url         TEXT,

  -- Passport / identity fields ------------------------------
  sex               TEXT CHECK (sex IN ('Macho', 'Hembra')),
  birth_date        DATE,
  color             TEXT,
  weight_kg         NUMERIC(5,2),
  sterilized        BOOLEAN DEFAULT false,
  microchip_number  TEXT UNIQUE,          -- ISO 11784/11785 chip id
  passport_number   TEXT UNIQUE,          -- official pet passport number
  country_of_origin TEXT DEFAULT 'El Salvador',

  -- Social counters -----------------------------------------
  followers         INT DEFAULT 0,
  posts_count       INT DEFAULT 0,

  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 5. TABLE: vaccine_catalog (reference — common vaccines)
-- ------------------------------------------------------------
-- Reference list of the common vaccines per species so the UI
-- can suggest what a healthy/travel-ready pet should have.
-- `required_for_travel` flags the ones authorities usually
-- demand for international travel (e.g. Rabia).
-- ============================================================
CREATE TABLE IF NOT EXISTS vaccine_catalog (
  id                    SERIAL PRIMARY KEY,
  name                  TEXT NOT NULL,
  species               TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')),
  description           TEXT,
  recommended_interval_months INT,        -- how often to re-apply
  required_for_travel   BOOLEAN DEFAULT false,
  UNIQUE (name, species)
);

INSERT INTO vaccine_catalog (name, species, description, recommended_interval_months, required_for_travel) VALUES
  ('Rabia',              'Perro', 'Vacuna antirrábica. Obligatoria para viajar.', 12, true),
  ('Moquillo (Distemper)','Perro','Parte del cuádruple/quíntuple canino.',        12, false),
  ('Parvovirus',         'Perro', 'Parte del cuádruple/quíntuple canino.',        12, false),
  ('Hepatitis',          'Perro', 'Adenovirus canino (parte de la múltiple).',    12, false),
  ('Leptospirosis',      'Perro', 'Recomendada en zonas húmedas/rurales.',        12, false),
  ('Tos de las perreras','Perro', 'Bordetella. Recomendada si socializa mucho.',  12, false),
  ('Rabia',              'Gato',  'Vacuna antirrábica. Obligatoria para viajar.', 12, true),
  ('Triple felina',      'Gato',  'Panleucopenia, rinotraqueítis y calicivirus.', 12, false),
  ('Leucemia felina',    'Gato',  'Recomendada para gatos con acceso al exterior.',12, false)
ON CONFLICT (name, species) DO NOTHING;


-- ============================================================
-- 6. TABLE: vaccines (per-pet vaccination records)
-- ============================================================
CREATE TABLE IF NOT EXISTS vaccines (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,            -- e.g. "Rabia"
  applied_date  DATE NOT NULL,
  next_due_date DATE,                     -- when the booster is due
  veterinarian  TEXT,
  clinic        TEXT,
  batch_number  TEXT,                     -- lote de la vacuna
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 7. TABLE: vet_records (per-pet veterinary visits / clinic)
-- ------------------------------------------------------------
-- Stores the vet/clinic data that matters for a passport and
-- for judging how well the animal is cared for.
-- ============================================================
CREATE TABLE IF NOT EXISTS vet_records (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id       UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  clinic_name  TEXT,
  vet_name     TEXT,
  phone        TEXT,
  address      TEXT,
  visit_date   DATE,
  reason       TEXT,                       -- motivo de la visita
  diagnosis    TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 8. TABLE: posts (social feed)
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id      UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  image_url   TEXT,
  likes       INT DEFAULT 0,
  comments    INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 9. TABLE: lost_pets (emergency reports)
-- ============================================================
CREATE TABLE IF NOT EXISTS lost_pets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_name        TEXT NOT NULL,
  breed           TEXT,
  species         TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')) DEFAULT 'Perro',
  description     TEXT,
  last_seen       TEXT,                    -- free-text location
  last_seen_date  DATE DEFAULT CURRENT_DATE,
  reward          TEXT,                    -- e.g. "$50", NULL if none
  status          TEXT CHECK (status IN ('activo', 'encontrado', 'cerrado')) DEFAULT 'activo',
  owner_name      TEXT NOT NULL,
  owner_phone     TEXT NOT NULL,
  photo_url       TEXT,

  -- AI-enriched fields (P4 fills these after Fal vision analysis)
  ai_breed        TEXT,
  ai_color        TEXT,
  ai_size         TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_lost_pets_updated_at
  BEFORE UPDATE ON lost_pets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 10. TABLE: sightings (lost pet sightings)
-- ============================================================
CREATE TABLE IF NOT EXISTS sightings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id   UUID NOT NULL REFERENCES lost_pets(id) ON DELETE CASCADE,
  comment     TEXT NOT NULL,
  location    TEXT,                        -- free-text location
  lat         FLOAT,                       -- map coordinate (Y)
  lng         FLOAT,                       -- map coordinate (X)
  author      TEXT DEFAULT 'Anónimo',
  confidence  FLOAT DEFAULT 0.7 CHECK (confidence BETWEEN 0 AND 1),
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 11. TABLE: breeds (reference catalog — read only)
-- ============================================================
CREATE TABLE IF NOT EXISTS breeds (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL UNIQUE,
  species TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')),
  size    TEXT CHECK (size IN ('Pequeño', 'Mediano', 'Grande')),
  origin  TEXT
);

INSERT INTO breeds (name, species, size, origin) VALUES
  ('Golden Retriever', 'Perro',  'Grande',   'Reino Unido'),
  ('Siamés',           'Gato',   'Mediano',  'Tailandia'),
  ('Labrador',         'Perro',  'Grande',   'Canadá'),
  ('Persa',            'Gato',   'Mediano',  'Irán'),
  ('Bulldog Francés',  'Perro',  'Pequeño',  'Francia'),
  ('Maine Coon',       'Gato',   'Grande',   'Estados Unidos'),
  ('Beagle',           'Perro',  'Mediano',  'Reino Unido'),
  ('Husky Siberiano',  'Perro',  'Grande',   'Rusia'),
  ('Chihuahua',        'Perro',  'Pequeño',  'México'),
  ('Mestizo',          'Perro',  'Mediano',  'El Salvador')
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 12. VIEW: pet_travel_status (is the pet ready to travel?)
-- ------------------------------------------------------------
-- A pet is considered travel-ready when it has:
--   * a microchip number,
--   * a passport number, and
--   * every travel-required vaccine (from vaccine_catalog)
--     applied AND not expired (next_due_date in the future).
-- ============================================================
CREATE OR REPLACE VIEW pet_travel_status AS
SELECT
  p.id AS pet_id,
  p.name,
  p.species,
  (p.microchip_number IS NOT NULL) AS has_microchip,
  (p.passport_number IS NOT NULL)  AS has_passport,
  NOT EXISTS (
    -- any travel-required vaccine for this species that is
    -- missing or expired => pet is NOT ready
    SELECT 1
    FROM vaccine_catalog vc
    WHERE vc.required_for_travel = true
      AND vc.species = p.species
      AND NOT EXISTS (
        SELECT 1
        FROM vaccines v
        WHERE v.pet_id = p.id
          AND v.name = vc.name
          AND (v.next_due_date IS NULL OR v.next_due_date >= CURRENT_DATE)
      )
  ) AS vaccines_up_to_date,
  (
    p.microchip_number IS NOT NULL
    AND p.passport_number IS NOT NULL
    AND NOT EXISTS (
      SELECT 1
      FROM vaccine_catalog vc
      WHERE vc.required_for_travel = true
        AND vc.species = p.species
        AND NOT EXISTS (
          SELECT 1
          FROM vaccines v
          WHERE v.pet_id = p.id
            AND v.name = vc.name
            AND (v.next_due_date IS NULL OR v.next_due_date >= CURRENT_DATE)
        )
    )
  ) AS is_travel_ready
FROM pets p;


-- ============================================================
-- 13. INDEXES (query performance for the common lookups)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_pets_owner_id       ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_posts_pet_id         ON posts(pet_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at     ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lost_pets_status     ON lost_pets(status);
CREATE INDEX IF NOT EXISTS idx_lost_pets_created_at ON lost_pets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sightings_report_id  ON sightings(report_id);
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id      ON vaccines(pet_id);
CREATE INDEX IF NOT EXISTS idx_vet_records_pet_id   ON vet_records(pet_id);
