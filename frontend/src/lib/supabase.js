// ============================================================
// PetConnect — Cliente de Supabase (solo para autenticación)
// ============================================================
// El frontend usa Supabase ÚNICAMENTE para la sesión del usuario
// (registro, login, logout, token). El resto de operaciones de
// datos siguen pasando por n8n (ver services/api.js).
//
// Variables requeridas en .env (ver .env.example):
//   VITE_SUPABASE_URL      — URL del proyecto
//   VITE_SUPABASE_ANON_KEY — llave publishable/anon (pública)
// ============================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en el .env — el login no funcionará."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
