import axios from "axios";
import { useAuth } from "../stores/authStore";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.sistemacontable.lat/api";

console.log("API_URL configurado:", API_URL);

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    console.log(
      "Interceptor de petición - token:",
      token ? `${token.substring(0, 15)}...` : "No hay token"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Header de autorización establecido:",
        `Bearer ${token.substring(0, 15)}...`
      );
    } else {
      console.warn("No hay token disponible para la petición a:", config.url);
    }

    return config;
  },
  (error) => {
    console.error("Error en interceptor de petición:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `Respuesta exitosa de ${response.config.url}:`,
      response.status
    );
    return response;
  },
  (error) => {
    console.error(
      "Error en respuesta:",
      error.response?.status,
      error.response?.statusText,
      error.response?.config?.url,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.warn("Error 401: Cerrando sesión automáticamente");
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
