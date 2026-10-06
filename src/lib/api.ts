import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  withCredentials: true,
});

// Django needs a fresh CSRF token on every non-GET request
// (it rotates after login, so don't cache it)
api.interceptors.request.use(async (config) => {
  if (config.method !== "get") {
    const { data } = await api.get("/api/csrf/");
    config.headers["X-CSRFToken"] = data.csrfToken;
  }
  return config;
});

export const errorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again."
) =>
  axios.isAxiosError(err) && err.response?.data?.error
    ? (err.response.data.error as string)
    : fallback;