import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized globally (e.g., logout user)
      console.warn("Unauthorized, redirecting to login...");
      // window.location.href = "/login"; // Uncomment if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
