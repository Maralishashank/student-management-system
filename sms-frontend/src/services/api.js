import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Request interceptor — attaches JWT to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// FIX: Added response interceptor for 401 errors.
//      Without this, if a token expires while the user is on a page, every API call
//      silently fails and the UI shows empty/broken data with no explanation.
//      Now any 401 response automatically clears the token and redirects to login,
//      giving the user a clear prompt to re-authenticate.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;