import { useState, useEffect } from "react";
import { getUserPets, savePet as apiSavePet } from "../services/api";
import { breeds, currentUser } from "../data/mockData"; // fallback data

export function usePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming currentUser is authenticated, we fetch their pets
    getUserPets(currentUser.id)
      .then((data) => { setPets(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const savePet = async (petData) => {
    try {
      await apiSavePet(petData);
      
      // Update local state if the pet already exists
      if (petData.id) {
        setPets(pets.map(p => p.id === petData.id ? petData : p));
      } else {
        // Optimistic addition
        setPets([...pets, { ...petData, id: Date.now() }]);
      }
    } catch (err) {
      console.error("Failed to save pet", err);
    }
  };

  return { pets, loading, error, breeds, savePet };
}
