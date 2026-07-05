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
- `vaccines` — vaccines the pet received (name, date, next dose, vet, notes).
- `vet_records` — vet visits: clinic, vet, `condition` (enfermedad/diagnóstico), notes.
- `posts` — social feed.
- `comments` — comments on feed posts (`post_id` → posts, `author_id` → users).
- `lost_pets` — emergency reports (`pet_id` links to a registered pet). `last_seen` is the text
  label; `last_seen_lat`/`last_seen_lng` are the optional shared GPS coords (NULL if the owner
  doesn't share location) used to draw the map pin.

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
