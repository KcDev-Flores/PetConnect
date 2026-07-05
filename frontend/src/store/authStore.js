// ============================================================
// PetConnect — Store de sesión (zustand + Supabase Auth)
// ============================================================
// Única fuente de verdad de la sesión del usuario. Supabase
// persiste la sesión en localStorage y la refresca solo; este
// store la expone a React y escucha los cambios.
//
// Uso típico:
//   const { user, login, logout } = useAuthStore();
//   const token = useAuthStore.getState().getAccessToken();
//     → mandar a n8n como header: Authorization: Bearer <token>
// ============================================================

import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useAuthStore = create((set, get) => ({
  user: null, // usuario autenticado (auth.users) o null
  session: null, // sesión activa de Supabase (incluye access_token)
  loading: false, // true mientras corre login/registro
  error: null, // mensaje del último error de auth
  initialized: false, // true cuando ya se restauró la sesión guardada

  /**
   * Restaura la sesión guardada y se suscribe a los cambios
   * (login, logout, token refrescado). Llamar UNA vez al montar la app.
   */
  initialize: async () => {
    if (get().initialized) return;
    set({ initialized: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      set({ session: newSession, user: newSession?.user ?? null });
    });
  },

  /**
   * Registra un usuario nuevo. El nombre se guarda en
   * user_metadata.name. Devuelve la data o null si hubo error.
   */
  register: async (name, email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) {
      set({ loading: false, error: error.message });
      return null;
    }
    set({ loading: false, session: data.session, user: data.user });
    return data;
  },

  /** Inicia sesión con email y contraseña. Devuelve la data o null. */
  login: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false, error: "Credenciales incorrectas" });
      return null;
    }
    set({ loading: false, session: data.session, user: data.user });
    return data;
  },

  /** Cierra la sesión y limpia el estado. */
  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, error: null });
  },

  /**
   * Token JWT vigente para llamadas a n8n:
   *   headers: { Authorization: `Bearer ${getAccessToken()}` }
   */
  getAccessToken: () => get().session?.access_token ?? null,
}));
