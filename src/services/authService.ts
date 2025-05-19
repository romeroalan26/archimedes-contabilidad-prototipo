import axiosInstance from "./axiosConfig";

interface LoginCredentials {
  correo: string;
  clave: string;
}

interface LoginResponse {
  token: string;
  usuario: {
    nombre: string;
    correo: string;
    rol: string;
    empresa_id: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },
};
