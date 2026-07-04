import { useMemo, useState } from "react";
import { breeds, pets } from "../data/mockData";
import PetCard from "../components/ui/PetCard";
import Badge from "../components/ui/Badge";
import Icon from "../components/icons/Icons";

export default function Search() {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("Todos");
  const [size, setSize] = useState("Todos");

  const speciesOptions = ["Todos", ...new Set(breeds.map((b) => b.species))];
  const sizeOptions = ["Todos", ...new Set(breeds.map((b) => b.size))];

  const filteredBreeds = useMemo(() => {
    return breeds.filter((b) => {
      const matchQuery = b.name.toLowerCase().includes(query.toLowerCase());
      const matchSpecies = species === "Todos" || b.species === species;
      const matchSize = size === "Todos" || b.size === size;
      return matchQuery && matchSpecies && matchSize;
    });
  }, [query, species, size]);

  const filteredPets = useMemo(() => {
    return pets.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.breed.toLowerCase().includes(query.toLowerCase());
      const matchSpecies = species === "Todos" || p.species === species;
      return matchQuery && matchSpecies;
    });
  }, [query, species]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Búsqueda Inteligente</h1>
        <p className="text-slate-500 mt-1">Explora razas y perfiles de mascotas</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon name="search" size={20} />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o raza..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Especie</label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="mt-1 block px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none text-sm"
            >
              {speciesOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tamaño</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 block px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none text-sm"
            >
              {sizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Razas ({filteredBreeds.length})</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredBreeds.map((breed) => (
            <div
              key={breed.id}
              className="bg-white rounded-xl border border-slate-100 p-4 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon name={breed.species === "Gato" ? "cat" : "dog"} size={18} className="text-emerald-600" />
                <p className="font-semibold text-slate-800">{breed.name}</p>
              </div>
              <div className="flex gap-1.5 mt-2">
                <Badge variant="info">{breed.species}</Badge>
                <Badge>{breed.size}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-2">{breed.origin}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Mascotas ({filteredPets.length})</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        {filteredPets.length === 0 && (
          <p className="text-center text-slate-400 py-8">No se encontraron mascotas con esos filtros</p>
        )}
      </section>
    </div>
  );
}
