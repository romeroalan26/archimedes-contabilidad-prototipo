import axios from "axios";
import { useAuth } from "../stores/authStore";

const API_URL = "https://api.sistemacontable.lat/api";

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
