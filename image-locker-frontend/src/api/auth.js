import api from "./client";

export async function signup(email, password) {
  const res = await api.post("/api/auth/signup", { email, password });
  return res.data; // { token, userId, email }
}

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}
