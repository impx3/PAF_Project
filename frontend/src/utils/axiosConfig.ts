import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: false,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (
    token &&
    config.headers &&
    config.url &&
    !config.url.startsWith("/auth")
  ) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default api;
