export function getStoredSessionUser() {
  try {
    return JSON.parse(localStorage.getItem("petconnect:user")) ?? null;
  } catch {
    return null;
  }
}

export function saveStoredSession(data) {
  const user = data?.user ?? data?.data?.user ?? data?.profile ?? null;
  const token = data?.token ?? data?.access_token ?? data?.data?.token ?? "";

  if (user) localStorage.setItem("petconnect:user", JSON.stringify(user));
  if (token) localStorage.setItem("petconnect:auth-token", token);
}

export function clearStoredSession() {
  localStorage.removeItem("petconnect:user");
  localStorage.removeItem("petconnect:auth-token");
}

export function getSessionUserId() {
  const user = getStoredSessionUser();
  return user?.id ?? user?.userId ?? user?.user_id ?? "";
}

export function createSessionProfile() {
  const user = getStoredSessionUser();
  const email = user?.email ?? "";

  return {
    id: getSessionUserId(),
    name: user?.name ?? user?.fullName ?? user?.full_name ?? email.split("@")[0] ?? "Usuario",
    email,
    icon: "user",
    location: user?.location ?? user?.residence ?? "Sin especificar",
    phone: user?.phone ?? user?.contact ?? "",
    joined: user?.created_at ? new Date(user.created_at).toLocaleDateString("es-SV") : "Cuenta activa",
    pets: [],
  };
}
