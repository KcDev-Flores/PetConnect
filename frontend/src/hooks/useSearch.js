import { useState, useMemo, useEffect } from "react";
import { getPublicPets } from "../services/api";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    let isActive = true;

    getPublicPets()
      .then((pets) => {
        if (!isActive) return;
        setAllPets(pets);
        setLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setAllPets([]);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const speciesOptions = useMemo(
    () => ["Todos", ...new Set(allPets.map((pet) => pet.species).filter(Boolean))],
    [allPets]
  );
  const sizeOptions = ["Todos"];
  const filteredBreeds = [];

  const filteredPets = useMemo(() => {
    return allPets.filter((pet) => {
      const matchQuery =
        !normalizedQuery ||
        pet.name.toLowerCase().includes(normalizedQuery) ||
        pet.breed.toLowerCase().includes(normalizedQuery) ||
        pet.owner.toLowerCase().includes(normalizedQuery) ||
        pet.bio.toLowerCase().includes(normalizedQuery);
      const matchSpecies = species === "Todos" || pet.species === species;
      return matchQuery && matchSpecies;
    });
  }, [allPets, normalizedQuery, species]);

  return {
    query, setQuery,
    species, setSpecies,
    size, setSize,
    speciesOptions, sizeOptions,
    filteredBreeds, filteredPets, allPets,
    loading,
  };
}
