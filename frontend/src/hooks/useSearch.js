import { useState, useMemo } from "react";
import { breeds, pets } from "../data/mockData";

export function useSearch() {
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

  return {
    query, setQuery,
    species, setSpecies,
    size, setSize,
    speciesOptions, sizeOptions,
    filteredBreeds, filteredPets,
  };
}
