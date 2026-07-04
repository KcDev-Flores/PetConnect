# PetConnect — Supabase (P5)

Data contract for the project. P3 wires the n8n flows to these tables.

## Files

| File | What it does | When to run |
|---|---|---|
| `schema.sql` | Creates all tables, the vaccine catalog, the `pet_travel_status` view and indexes. | First. Always. |
| `seed.sql` | Inserts demo data mirroring `frontend/src/data/mockData.js`. | Optional. Only for testing without real data. |

## How to run

1. Supabase → **Database → SQL Editor → New Query**.
2. Paste `schema.sql`, run it.
3. (Optional) Paste `seed.sql`, run it to load demo data.

Both files are safe to re-run (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`).

## Tables

- `users` — registered owners (`password_hash` is never sent to the frontend).
- `pets` — registered pets + **digital passport** (microchip, passport number, sex, weight, sterilized, country).
- `vaccine_catalog` — reference list of common vaccines per species; `required_for_travel` flags the ones needed to travel.
- `vaccines` — per-pet vaccination records.
- `vet_records` — per-pet veterinary visits / clinic data.
- `posts` — social feed.
- `lost_pets` — emergency reports (`ai_*` columns are filled by P4's Fal step).
- `sightings` — sightings for a lost pet (`lat`/`lng` feed the map).
- `breeds` — reference catalog.
- `pet_travel_status` (view) — computes `is_travel_ready` (has microchip + passport + all travel-required vaccines up to date).

## Naming convention

- Table/column names are **English**.
- Enum **values** stay in **Spanish** (`'Perro'`, `'Gato'`, `status 'activo'`) because the
  frontend already uses those exact strings. The DB is `snake_case`; the frontend is
  `camelCase`, so n8n (P3) maps between them, e.g.:

  | DB (`lost_pets`) | Frontend (`api.js`) |
  |---|---|
  | `pet_name` | `petName` |
  | `last_seen` | `lastSeen` |
  | `owner_phone` | `ownerPhone` |
  | `photo_url` | `photoUrl` |

## Notes for later (not blocking)

- Enable **Row Level Security (RLS)** policies before going public. For the hackathon the
  anon key + n8n service role is enough.
- The Firecrawl-scraped El Salvador dataset (P5, next task) will be delivered as an extra
  `seed_real.sql` / JSON that follows this same schema.
