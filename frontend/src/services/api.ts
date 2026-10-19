import axios from "axios";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // HTTP-only cookie auth
});

api.interceptors.response.use(
  (r) => r,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) window.dispatchEvent(new Event("auth:expired"));
    return Promise.reject(err);
  }
);

export default api;
