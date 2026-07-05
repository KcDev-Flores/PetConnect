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

// Valores por defecto del proyecto (son públicos: URL + llave
// publishable/anon). Se pueden sobreescribir vía .env.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://mmmtvjdjxmuplqeevkkh.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_r1zt0P3rBZMVQGqn9abJ_A_Y5pJ0IQQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
