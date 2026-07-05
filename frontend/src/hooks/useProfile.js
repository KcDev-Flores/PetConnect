import { createSessionProfile } from "../utils/sessionUser";
import { usePets } from "./usePets";

export function useProfile() {
  const currentUser = createSessionProfile();
  const { pets: userPets } = usePets();

  return { currentUser, userPets };
}
