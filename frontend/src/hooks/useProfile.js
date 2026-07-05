import { currentUser, pets } from "../data/mockData";

export function useProfile() {
  const userPets = pets.filter((p) => currentUser.pets.includes(p.id));

  return { currentUser, userPets };
}
