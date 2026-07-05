import { useMemo, useState } from "react";
import { useSearch } from "../hooks/useSearch";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";

const FOLLOWED_PETS_KEY = "petconnect:followed-pets";

function readFollowedPetIds() {
  try {
    return JSON.parse(localStorage.getItem(FOLLOWED_PETS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveFollowedPetIds(ids) {
  localStorage.setItem(FOLLOWED_PETS_KEY, JSON.stringify(ids));
}

function createPassportInfo(pet) {
  return pet.passport ?? {
    code: `PC-${String(pet.id).padStart(6, "0")}`,
    microchip: `SV-2026-${String(4300 + pet.id)}`,
    status: "Verificado",
  };
}

function PetProfileModal({ pet, isFollowing, onClose, onToggleFollow }) {
  if (!pet) return null;
  const passport = createPassportInfo(pet);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/65 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:py-8">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="relative h-44 bg-gradient-to-r from-emerald-300 via-sky-300 to-slate-800">
          {pet.photoUrl && <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            Cerrar
          </button>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-3xl bg-white p-2 shadow-xl">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="h-20 w-20 rounded-2xl object-cover" />
                ) : (
                  <Avatar icon={pet.icon} size="lg" color={pet.color} />
                )}
              </div>
              <div className="pb-1 text-white">
                <h3 className="text-3xl font-black leading-tight">{pet.name}</h3>
                <p className="text-sm font-semibold text-white/85">{pet.breed}</p>
              </div>
            </div>
            <Badge variant={passport.status === "Verificado" ? "success" : "warning"}>{passport.status}</Badge>
          </div>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{pet.species}</Badge>
            <Badge>{pet.age}</Badge>
            <Badge>{passport.code}</Badge>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">{pet.bio}</p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xl font-black text-slate-900">{pet.posts}</p>
              <p className="text-xs font-semibold text-slate-400">Publicaciones</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-center">
              <p className="text-xl font-black text-slate-900">{pet.followers}</p>
              <p className="text-xs font-semibold text-slate-400">Seguidores</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <Icon name="check" size={24} className="mx-auto text-emerald-500" />
              <p className="mt-1 text-xs font-bold text-emerald-700">{passport.status}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <h4 className="font-black text-slate-900">Ficha del animal</h4>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Especie</dt>
                  <dd className="font-bold text-slate-800">{pet.species}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Raza</dt>
                  <dd className="text-right font-bold text-slate-800">{pet.breed}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Edad</dt>
                  <dd className="font-bold text-slate-800">{pet.age}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Dueño</dt>
                  <dd className="text-right font-bold text-slate-800">{pet.owner}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
              <h4 className="font-black text-emerald-900">Pasaporte</h4>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-700/70">ID</dt>
                  <dd className="font-bold text-emerald-950">{passport.code}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-700/70">Microchip</dt>
                  <dd className="text-right font-bold text-emerald-950">{passport.microchip}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-700/70">Estado</dt>
                  <dd className="font-bold text-emerald-950">{passport.status}</dd>
                </div>
              </dl>
            </section>
          </div>

          <button
            type="button"
            onClick={() => onToggleFollow?.(pet.id)}
            className={`mt-5 w-full rounded-2xl px-5 py-3 text-sm font-black transition-colors ${
              isFollowing
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-slate-900 text-white hover:bg-emerald-600"
            }`}
          >
            {isFollowing ? "Siguiendo" : "Seguir perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PetExploreCard({ pet, isFollowing, onOpen, onToggleFollow }) {
  return (
    <article
      onClick={() => onOpen(pet)}
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md cursor-pointer"
    >
      <div className="relative aspect-square bg-gradient-to-br from-emerald-200 via-sky-200 to-slate-700">
        {pet.photoUrl ? (
          <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/80 text-emerald-600 shadow-xl backdrop-blur">
              <Icon name={pet.icon || "paw"} size={28} />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <h3 className="truncate text-sm font-black leading-tight">{pet.name}</h3>
          <p className="truncate text-[10px] font-semibold text-white/80">{pet.breed}</p>
        </div>
      </div>
      <div className="p-2.5">
        <div className="flex flex-wrap gap-1">
          <Badge variant="info">{pet.species}</Badge>
        </div>
        <p className="mt-2 line-clamp-1 text-[11px] leading-relaxed text-slate-500">{pet.bio}</p>
        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>{pet.followers} seguidores</span>
          <span className="text-emerald-600">Ver perfil</span>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFollow?.(pet.id);
          }}
          className={`mt-2 w-full rounded-xl px-3 py-1.5 text-[11px] font-black transition-colors ${
            isFollowing
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-900 text-white hover:bg-emerald-600"
          }`}
        >
          {isFollowing ? "Siguiendo" : "Seguir"}
        </button>
      </div>
    </article>
  );
}

function BreedTile({ breed, featured = false }) {
  return (
    <article
      className={`rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md ${
        featured ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">{breed.species}</p>
          <h3 className="mt-1 text-xl font-black text-slate-900">{breed.name}</h3>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <Icon name={breed.species === "Gato" ? "cat" : "dog"} size={24} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{breed.size}</Badge>
        <Badge variant="info">{breed.origin}</Badge>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        Ideal para descubrir perfiles, cuidados y animales similares dentro de PetConnect.
      </p>
    </article>
  );
}

export default function Search() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [followedPetIds, setFollowedPetIds] = useState(() => readFollowedPetIds());
  const {
    query, setQuery,
    species, setSpecies,
    size, setSize,
    speciesOptions, sizeOptions,
    filteredBreeds, filteredPets,
    allPets,
  } = useSearch();

  const featuredPets = useMemo(
    () =>
      [...filteredPets]
        .sort((a, b) => b.followers - a.followers)
        .slice(0, 8)
        .map((pet) => ({
          ...pet,
          followers: pet.followers + (followedPetIds.includes(pet.id) ? 1 : 0),
        })),
    [filteredPets, followedPetIds]
  );

  const handleToggleFollow = (petId) => {
    setFollowedPetIds((current) => {
      const nextIds = current.includes(petId)
        ? current.filter((id) => id !== petId)
        : [...current, petId];

      saveFollowedPetIds(nextIds);
      return nextIds;
    });
  };

  const hasQuery = query.trim().length > 0 || species !== "Todos" || size !== "Todos";
  const filterChips = [
    { label: "Todos", species: "Todos", size: "Todos" },
    { label: "Perros", species: "Perro", size },
    { label: "Gatos", species: "Gato", size },
    { label: "Grandes", species, size: "Grande" },
    { label: "Medianos", species, size: "Mediano" },
    { label: "Pequenos", species, size: "Pequeño" },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,#ffffff,#f8fafc_45%,#ecfeff)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Explorar</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Busca perfiles, razas y momentos.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Descubre animales de la comunidad con una vista mas visual, rapida y ordenada.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white/75 p-3 shadow-sm backdrop-blur">
            <div className="text-center">
              <p className="text-xl font-black text-slate-900">{allPets.length}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Perfiles</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-slate-900">{filteredBreeds.length}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Razas</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white bg-white p-3 shadow-sm">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={21} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar mascota, raza, dueno o personalidad..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-base font-semibold text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {filterChips.map((chip) => {
              const active = species === chip.species && size === chip.size;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setSpecies(chip.species);
                    setSize(chip.size);
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-black transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl bg-slate-50 px-3 py-2">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Especie</span>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
              >
                {speciesOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="rounded-2xl bg-slate-50 px-3 py-2">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Tamano</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
              >
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {hasQuery ? "Resultados principales" : "Perfiles destacados"}
            </h2>
            <p className="text-sm text-slate-500">{filteredPets.length} perfiles encontrados</p>
          </div>
        </div>

        {featuredPets.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {featuredPets.map((pet) => (
              <PetExploreCard
                key={pet.id}
                pet={pet}
                isFollowing={followedPetIds.includes(pet.id)}
                onOpen={setSelectedPet}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Icon name="search" size={34} className="mx-auto text-slate-300" />
            <h3 className="mt-3 font-black text-slate-800">No encontramos perfiles</h3>
            <p className="mt-1 text-sm text-slate-400">Prueba con otro nombre, raza o filtro.</p>
          </div>
        )}
      </section>

      <section>
        <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-900">Razas</h2>
              <p className="text-sm text-slate-500">{filteredBreeds.length} coincidencias</p>
            </div>
            <Icon name="paw" size={22} className="text-slate-300" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBreeds.map((breed, index) => (
              <BreedTile key={breed.id} breed={breed} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <PetProfileModal
        pet={
          selectedPet
            ? {
                ...selectedPet,
                followers: selectedPet.followers + (followedPetIds.includes(selectedPet.id) ? 1 : 0),
              }
            : null
        }
        isFollowing={selectedPet ? followedPetIds.includes(selectedPet.id) : false}
        onClose={() => setSelectedPet(null)}
        onToggleFollow={handleToggleFollow}
      />
    </div>
  );
}
