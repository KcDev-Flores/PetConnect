import { useState } from "react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Icon from "../icons/Icons";

function PetDetailModal({ pet, isFollowing, onClose, onToggleFollow }) {
  if (!pet) return null;
  const passport = pet.passport ?? {
    code: `PC-${String(pet.id).padStart(6, "0")}`,
    microchip: `SV-2026-${String(4300 + pet.id)}`,
    status: "Verificado",
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-slate-950/65 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:py-8">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="relative h-44 bg-gradient-to-r from-emerald-300 via-sky-300 to-slate-800">
          {pet.photoUrl && (
            <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />
          )}
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
                  <dt className="text-slate-400">Nombre</dt>
                  <dd className="font-bold text-slate-800">{pet.name}</dd>
                </div>
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
                  <dt className="text-emerald-700/70">Dueño</dt>
                  <dd className="text-right font-bold text-emerald-950">{pet.owner}</dd>
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
            {isFollowing ? "Siguiendo" : "Seguir a este perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FriendSuggestions({ pets = [], followedIds = [], onToggleFollow }) {
  const [selectedPet, setSelectedPet] = useState(null);

  if (!pets.length) return null;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Sugerencias</p>
          <h2 className="font-black text-slate-900">Animalitos que podrias seguir</h2>
        </div>
        <Icon name="users" size={22} className="text-slate-300" />
      </div>

      <div className="flex gap-3 overflow-x-auto p-4">
        {pets.map((pet) => {
          const isFollowing = followedIds.includes(pet.id);

          return (
            <article
              key={pet.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPet(pet)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setSelectedPet(pet);
              }}
              className="w-[210px] shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="relative h-24 bg-gradient-to-r from-emerald-300 via-sky-300 to-slate-700">
                {pet.photoUrl && (
                  <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                <div className="absolute -bottom-8 left-4 rounded-2xl bg-white p-1.5 shadow-lg">
                  {pet.photoUrl ? (
                    <img src={pet.photoUrl} alt={pet.name} className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <Avatar icon={pet.icon} size="md" color={pet.color} />
                  )}
                </div>
              </div>

              <div className="px-4 pb-4 pt-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-black text-slate-900">{pet.name}</h3>
                    <p className="truncate text-xs font-bold text-emerald-600">{pet.breed}</p>
                  </div>
                  <Badge variant="info">{pet.species}</Badge>
                </div>

                <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-500">
                  {pet.bio}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-2xl bg-white p-2">
                    <p className="text-sm font-black text-slate-900">{pet.followers}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Seguidores</p>
                  </div>
                  <div className="rounded-2xl bg-white p-2">
                    <p className="text-sm font-black text-slate-900">{pet.posts}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Posts</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Icon name="user" size={14} />
                  <span className="truncate">{pet.owner}</span>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFollow?.(pet.id);
                  }}
                  className={`mt-4 w-full rounded-2xl px-4 py-2.5 text-sm font-black transition-colors ${
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
        })}
      </div>
      </section>

      <PetDetailModal
        pet={selectedPet}
        isFollowing={selectedPet ? followedIds.includes(selectedPet.id) : false}
        onClose={() => setSelectedPet(null)}
        onToggleFollow={onToggleFollow}
      />
    </>
  );
}
