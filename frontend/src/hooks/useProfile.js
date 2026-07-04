import { useState, useEffect } from "react";
import { currentUser, pets } from "../data/mockData";

export function useProfile() {
  const [user, setUser] = useState(currentUser);
  
  // Currently getting pets from mockData directly since api.getUserPets expects a userId
  // For the sake of simplicity, we just filter the mock pets as the component did
  const userPets = pets.filter((p) => user.pets.includes(p.id));

  return { currentUser: user, userPets };
}
