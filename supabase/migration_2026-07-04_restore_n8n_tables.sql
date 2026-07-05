-- ============================================================
-- PetConnect — Migration: restore tables used by n8n (2026-07-04)
-- ============================================================
-- n8n exposes endpoints for comments, vaccines, vet records and
-- sightings, so these tables must exist. Run this ONCE in the
-- Supabase SQL Editor of the REAL database. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS sightings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lost_pet_id   UUID NOT NULL REFERENCES lost_pets(id) ON DELETE CASCADE,
  description   TEXT,
  location      TEXT,
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  reporter_name TEXT,
  reporter_phone TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
