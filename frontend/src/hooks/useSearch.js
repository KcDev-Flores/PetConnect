import { useState, useMemo } from "react";
import { breeds, pets } from "../data/mockData";
import { loadOwnedPets } from "../data/localPets";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [localPets] = useState(() => loadOwnedPets());

  const allPets = useMemo(() => [...pets, ...localPets], [localPets]);
  const speciesOptions = ["Todos", ...new Set(breeds.map((b) => b.species))];
  const sizeOptions = ["Todos", ...new Set(breeds.map((b) => b.size))];
  const normalizedQuery = query.trim().toLowerCase();

  const filteredBreeds = useMemo(() => {
    return breeds.filter((b) => {
      const matchQuery =
        !normalizedQuery ||
        b.name.toLowerCase().includes(normalizedQuery) ||
        b.origin.toLowerCase().includes(normalizedQuery);
      const matchSpecies = species === "Todos" || b.species === species;
      const matchSize = size === "Todos" || b.size === size;
      return matchQuery && matchSpecies && matchSize;
    });
  }, [normalizedQuery, species, size]);

  const filteredPets = useMemo(() => {
    return allPets.filter((p) => {
      const breedInfo = breeds.find((breed) => breed.name === p.breed);
      const matchQuery =
        !normalizedQuery ||
        p.name.toLowerCase().includes(normalizedQuery) ||
        p.breed.toLowerCase().includes(normalizedQuery) ||
        p.owner.toLowerCase().includes(normalizedQuery) ||
        p.bio.toLowerCase().includes(normalizedQuery);
      const matchSpecies = species === "Todos" || p.species === species;
      const matchSize = size === "Todos" || breedInfo?.size === size;
      return matchQuery && matchSpecies && matchSize;
    });
  }, [allPets, normalizedQuery, species, size]);

  return {
    query, setQuery,
    species, setSpecies,
    size, setSize,
    speciesOptions, sizeOptions,
    filteredBreeds, filteredPets, allPets,
  };
}
