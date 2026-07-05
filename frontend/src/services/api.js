import {
  normalizeCommentList,
  normalizeLostPetList,
  normalizePetList,
  normalizePostList,
  normalizeVetRecordList,
} from "../utils/normalizers";
import { saveStoredSession } from "../utils/sessionUser";

const BASE_URL = import.meta.env.VITE_N8N_BASE_URL || "https://nayelsmadai.app.n8n.cloud/webhook";

function getToken() {
  return localStorage.getItem("petconnect:auth-token") ?? "";
}

function jsonHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseResponse(res, fallback = {}) {
  const text = await res.text();
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}/${path}`, {
    ...options,
    headers: {
      ...jsonHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Error en ${path}`);
  }

  return parseResponse(res);
}

export async function getLostPets() {
  const payload = await request("get-lost-pets");
  return normalizeLostPetList(payload);
}

export async function reportLostPet(data) {
  return request("report-lost-pet", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addSighting(data) {
  return request("add-sighting", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function searchByPhoto(photoUrl) {
  return request("search-by-photo", {
    method: "POST",
    body: JSON.stringify({ photoUrl }),
  });
}

export async function getUserPets(userId = "") {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  const payload = await request(`get-user-pets${query}`);
  return normalizePetList(payload);
}

export async function getPublicPets() {
  const payload = await request("get-user-pets");
  return normalizePetList(payload);
}

export async function savePet(data) {
  return request("save-pet", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function saveVaccine(data) {
  return request("save-vaccine", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getVetRecords(petId) {
  const query = petId ? `?petId=${encodeURIComponent(petId)}` : "";
  const payload = await request(`get-vet-records${query}`);
  return normalizeVetRecordList(payload);
}

export async function saveVetRecord(data) {
  return request("save-vet-record", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getVaccines(petId) {
  const query = petId ? `?petId=${encodeURIComponent(petId)}` : "";
  const payload = await request(`get-vaccines${query}`);
  return normalizeVetRecordList(payload);
}

export async function getPosts() {
  const payload = await request("get-posts");
  return normalizePostList(payload);
}

export async function createPost(data) {
  return request("create-post", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getComments(postId) {
  const query = postId ? `?postId=${encodeURIComponent(postId)}` : "";
  const payload = await request(`get-comments${query}`);
  return normalizeCommentList(payload);
}

export async function addComment(data) {
  return request("add-comment", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(email, password) {
  const data = await request("login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveStoredSession(data);
  return data;
}

export async function register(name, email, password) {
  const data = await request("register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  saveStoredSession(data);
  return data;
}
