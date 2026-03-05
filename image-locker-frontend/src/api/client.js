import axios from "axios";
import { getToken } from "../utils/token";

/**
 * Production: call same-origin (/api) so nginx handles routing.
 * Dev (vite): VITE_API_BASE_URL can be set (optional).
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL, // "" means relative URLs like "/api/auth/signup"
});
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;