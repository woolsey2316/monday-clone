import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;
  try {
    const { data } = await axios.post(`${API_BASE}/api/auth/token/refresh/`, {
      refresh,
    });
    localStorage.setItem("access_token", data.access);
    return data.access as string;
  } catch {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const access = await refreshPromise;
      if (access) {
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
