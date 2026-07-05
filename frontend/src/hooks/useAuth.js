import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Hook de autenticación. Envuelve el store de sesión (zustand +
 * Supabase Auth) y agrega la navegación tras login/registro/logout.
 * Mantiene la misma interfaz que usan las vistas (loginUser,
 * registerUser, loading, error).
 */
export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    if (data) navigate("/");
    return data;
  };

  const registerUser = async (name, email, password) => {
    const data = await register(name, email, password);
    if (data) navigate("/");
    return data;
  };

  const logoutUser = async () => {
    await logout();
    navigate("/login");
  };

  return {
    user,
    session,
    isAuthenticated: !!session,
    loginUser,
    registerUser,
    logoutUser,
    loading,
    error,
  };
}
