import axios from "axios";
import { getToken } from "../utils/token";

// For Vite:
// - define VITE_API_BASE_URL in .env / build args for Docker
// - fallback allows local dev without env issues
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (window?.location?.hostname === "localhost"
    ? "http://localhost:8080"
    : "http://10.0.0.23:8080");

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;