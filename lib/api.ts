import { API_BASE_URL } from "./config";

const BASE_URL = API_BASE_URL;

function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("patterson-crm-token")
    : null;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "API error");
  }
  return res.json();
}
