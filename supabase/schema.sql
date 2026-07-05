-- ============================================================
-- PetConnect — Database schema (Supabase / PostgreSQL)
-- ============================================================
-- Owner: P5 (Data & DevOps). This is the DATA CONTRACT that P3
-- consumes from n8n. Run this whole file in the Supabase SQL
-- Editor (Database -> SQL Editor -> New Query) in order.
--
-- Keep it simple: these tables just STORE the basic data the
-- user enters (profile, pets, posts, lost reports) and the
-- frontend shows it. No validation logic lives in the DB.
--
-- Conventions:
--   * Table and column names are in ENGLISH.
--   * Enum VALUES are kept in Spanish ('Perro', 'Gato', 'activo', ...)
--     on purpose, because the frontend (P1/P2) already uses those
--     exact strings in mockData.js. Do NOT translate them.
-- ============================================================

-- 1. EXTENSIONS (UUID generation)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. TABLE: users (registered owners)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,            -- never exposed to the frontend
  avatar_url    TEXT,
  location      TEXT DEFAULT 'El Salvador',
  created_at    TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 2. TABLE: pets (pet profile / passport basics)
-- ============================================================
CREATE TABLE IF NOT EXISTS pets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  breed       TEXT,
  species     TEXT CHECK (species IN ('Perro', 'Gato', 'Otro')) DEFAULT 'Perro',
  age         TEXT,                        -- human label, e.g. "3 años"
  sex         TEXT,                        -- "Macho" / "Hembra"
  color       TEXT,
  weight      TEXT,                        -- free text, e.g. "12 kg"
  bio         TEXT,
  photo_url   TEXT,
  followers   INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 3. TABLE: posts (social feed)
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
-- 4. VIEW: posts_with_pets (feed with pet info, camelCase for React)
-- ============================================================
CREATE OR REPLACE VIEW posts_with_pets AS
SELECT
  p.id,
  p.pet_id      AS "petId",
  pets.name     AS "petName",
  pets.species  AS "icon",
  p.content,
  p.image_url   AS "image",
  p.likes,
  p.comments,
  p.created_at  AS "time"
FROM posts p
JOIN pets ON pets.id = p.pet_id;


-- ============================================================
-- 5. TABLE: lost_pets (emergency reports)
-- ============================================================
-- pet_id is OPTIONAL: anyone can report a stray pet without it
-- being registered. pet_name/breed/species are entered free-form.
CREATE TABLE IF NOT EXISTS lost_pets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id          UUID REFERENCES pets(id) ON DELETE CASCADE, -- optional link to a registered pet
  pet_name        TEXT NOT NULL,
  breed           TEXT,
  species         TEXT,
  description     TEXT,
  last_seen       TEXT,                     -- free-text location label
  last_seen_lat   DECIMAL(9,6),             -- optional: shared GPS latitude
  last_seen_lng   DECIMAL(9,6),             -- optional: shared GPS longitude
  last_seen_date  DATE DEFAULT CURRENT_DATE,
  reward          TEXT,                     -- e.g. "$50", NULL if none
  status          TEXT CHECK (status IN ('activo', 'encontrado', 'cerrado')) DEFAULT 'activo',
  owner_name      TEXT NOT NULL,
  owner_phone     TEXT NOT NULL,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
                                                                              

-- ============================================================
-- 6. TABLE: comments (social feed comments — used by n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 7. TABLE: vaccines (vaccines the pet has received — used by n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS vaccines (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id        UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  applied_date  DATE,
  next_due_date DATE,
  veterinarian  TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 8. TABLE: vet_records (vet visits — used by n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS vet_records (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id       UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  clinic_name  TEXT,
  vet_name     TEXT,
  phone        TEXT,
  visit_date   DATE,
  condition    TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 9. TABLE: sightings (sightings of lost pets — used by n8n)
-- ============================================================
CREATE TABLE IF NOT EXISTS sightings (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lost_pet_id    UUID NOT NULL REFERENCES lost_pets(id) ON DELETE CASCADE,
  description    TEXT,
  location       TEXT,
  lat            DECIMAL(9,6),
  lng            DECIMAL(9,6),
  reporter_name  TEXT,
  reporter_phone TEXT,
  created_at     TIMESTAMPTZ DEFAULT now()
);
