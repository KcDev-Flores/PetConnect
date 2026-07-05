# PetConnect — Supabase (P5)

Data contract for the project. P3 wires the n8n flows to these tables.
Simple by design: the DB just stores what the user enters; the frontend shows it.

## Files

| File | What it does | When to run |
|---|---|---|
| `schema.sql` | Creates all tables (+ breeds catalog). | First. Always. |
| `seed.sql` | Demo data mirroring `frontend/src/data/mockData.js`. | Optional, for testing. |

## How to run

1. Supabase → **Database → SQL Editor → New Query**.
2. Paste `schema.sql`, run it.
3. (Optional) Paste `seed.sql`, run it to load demo data.

Both files are safe to re-run (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`).

## Tables

- `users` — registered owners (`password_hash` never sent to the frontend).
- `pets` — pet profile: name, breed, species, age, sex, color, weight, bio, photo.
- `posts` — social feed.
- `lost_pets` — emergency reports. `pet_id` is optional (strays can be reported without a
  registered pet); `pet_name`/`breed`/`species` are entered free-form. `last_seen` is the text
  label; `last_seen_lat`/`last_seen_lng` are the optional shared GPS coords (NULL if the owner
  doesn't share location) used to draw the map pin.

## Views

- `posts_with_pets` — feed posts joined with the pet's name/species, columns already mapped to
  camelCase (`petId`, `petName`, `icon`, `image`, `time`) so the frontend can consume them as-is.

## Migration for an existing database

If the tables already exist in the real database, do NOT re-run `schema.sql`; run
`migration_2026-07-04_frontend_fixes.sql` instead (ALTERs `lost_pets`, creates the view and
drops `vaccines`/`vet_records`/`comments`).

## Naming convention

- Table/column names are **English**.
- Enum **values** stay in **Spanish** (`'Perro'`, `'Gato'`, `status 'activo'`) because the
  frontend already uses those exact strings. The DB is `snake_case`; the frontend is
  `camelCase`, so n8n (P3) maps between them, e.g. `pet_name` → `petName`,
  `last_seen` → `lastSeen`, `owner_phone` → `ownerPhone`, `photo_url` → `photoUrl`.

## Notes (not blocking)

- Enable Row Level Security (RLS) before going public. For the hackathon the anon key +
  n8n is enough.
- Next P5 task: real El Salvador dataset via Firecrawl, delivered as an extra seed file
  following this same schema.
