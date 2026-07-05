import { useAuthStore } from "../store/authStore";
import { usePets } from "./usePets";

export function useProfile() {
  const { user } = useAuthStore();
  const { pets: userPets } = usePets();

  const currentUser = {
    name: user?.user_metadata?.name || "Usuario Anónimo",
    email: user?.email || "",
    joined: user ? new Date(user.created_at).getFullYear() : "Recientemente",
  };

  return { currentUser, userPets };
}
