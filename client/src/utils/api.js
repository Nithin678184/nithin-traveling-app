import axios from "axios";

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return "http://localhost:5000/api";
};

export const API_BASE_URL = getApiBaseUrl();
export const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const explicitRole = config.headers?.["X-Auth-Role"];
  if (explicitRole) {
    delete config.headers["X-Auth-Role"];
  }

  const role =
    explicitRole ||
    (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") ? "admin" : "passenger");
  const token = localStorage.getItem(role === "admin" ? "nta_admin_token" : "nta_passenger_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const assetUrl = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `${SERVER_URL}${path}`;
};

export default api;
