import { useState, useEffect } from "react";
import { getUserPets, savePet as apiSavePet } from "../services/api";
import { getSessionUserId } from "../utils/sessionUser";

export function usePets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getSessionUserId();

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => getUserPets(userId))
      .then((data) => {
        if (!isActive) return;
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  const savePet = async (petData) => {
    const saved = await apiSavePet({ ...petData, userId });
    const nextPet = { ...petData, id: saved.petId ?? saved.id ?? petData.id ?? Date.now() };

    setPets((currentPets) => {
      if (petData.id) {
        return currentPets.map((pet) => String(pet.id) === String(petData.id) ? nextPet : pet);
      }

      return [nextPet, ...currentPets];
    });

    return saved;
  };

  return { pets, loading, error, breeds: [], savePet };
}
