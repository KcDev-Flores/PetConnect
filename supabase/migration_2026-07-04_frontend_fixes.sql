-- ============================================================
-- PetConnect — Migration: align DB with frontend (2026-07-04)
-- ============================================================
-- Run this ONCE in the Supabase SQL Editor of the REAL database
-- (the one that already has the tables created). It applies the
-- same changes that are now reflected in schema.sql:
--   1. lost_pets: pet_id optional + pet_name/breed/species columns
--   2. posts_with_pets view (camelCase fields for React)
--   3. Drop unused MVP tables: vaccines, vet_records, comments
-- Safe to re-run: uses IF EXISTS / OR REPLACE.
-- ============================================================


-- 1. lost_pets: pet_id optional, add free-form pet fields --------
ALTER TABLE lost_pets ALTER COLUMN pet_id DROP NOT NULL;

ALTER TABLE lost_pets ADD COLUMN IF NOT EXISTS pet_name TEXT;
ALTER TABLE lost_pets ADD COLUMN IF NOT EXISTS breed    TEXT;
ALTER TABLE lost_pets ADD COLUMN IF NOT EXISTS species  TEXT;

-- Backfill pet_name from the linked pet for existing rows, then
-- enforce NOT NULL (new reports must always carry a name).
UPDATE lost_pets lp
SET pet_name = p.name,
    breed    = COALESCE(lp.breed, p.breed),
    species  = COALESCE(lp.species, p.species)
FROM pets p
WHERE lp.pet_id = p.id AND lp.pet_name IS NULL;

UPDATE lost_pets SET pet_name = 'Desconocido' WHERE pet_name IS NULL;

ALTER TABLE lost_pets ALTER COLUMN pet_name SET NOT NULL;


-- 2. View for the social feed (camelCase for React) --------------
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


-- 3. Drop tables not used by the MVP ------------------------------
DROP TABLE IF EXISTS sightings   CASCADE;
DROP TABLE IF EXISTS comments    CASCADE;
DROP TABLE IF EXISTS vaccines    CASCADE;
DROP TABLE IF EXISTS vet_records CASCADE;
