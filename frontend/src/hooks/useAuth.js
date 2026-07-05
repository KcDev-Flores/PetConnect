import { useState } from "react";
import { login, register } from "../services/api";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      // Here you would normally save the token and user to context or local storage
      navigate("/");
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(name, email, password);
      navigate("/");
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, registerUser, loading, error };
}
