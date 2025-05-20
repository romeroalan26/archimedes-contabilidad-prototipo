import axiosInstance from "../axiosConfig";
import { Client } from "../../types/types";
import { useAuth } from "../../stores/authStore";

const clientEndpoint = "/clientes";
// Asegurarnos de que el empresa_id sea un UUID válido
const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

// Verificar si la variable de entorno está definida y es un UUID válido
if (!EMPRESA_ID) {
  console.error(
    "❌ ERROR: La variable de entorno VITE_EMPRESA_ID no está definida. " +
      "Las operaciones de creación y actualización de clientes fallarán."
  );
} else if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    EMPRESA_ID
  )
) {
  console.error(
    "❌ ERROR: La variable de entorno VITE_EMPRESA_ID no es un UUID válido. " +
      "El valor actual es: " +
      EMPRESA_ID
  );
}

// Función para validar el RNC/Cédula
const validateRncCedula = (rnc: string): string => {
  // Eliminar cualquier carácter que no sea número
  const cleanRnc = rnc.replace(/\D/g, "");

  // Validar longitud
  if (cleanRnc.length > 11) {
    throw new Error("El RNC/Cédula no puede tener más de 11 dígitos");
  }

  // Validar que no esté vacío
  if (cleanRnc.length === 0) {
    throw new Error("El RNC/Cédula es obligatorio");
  }

  return cleanRnc;
};

// Función para depuración
const logToken = () => {
  const token = useAuth.getState().token;
  console.log(
    "Token disponible:",
    !!token,
    token ? `${token.substring(0, 15)}...` : "No hay token"
  );
  return token;
};

// Adaptar el formato de la API al formato de la aplicación
const adaptApiClient = (apiClient: any): Client => {
  // Log para depuración
  console.log("Adaptando datos de API:", apiClient);

  return {
    id: apiClient.cliente_id,
    name: apiClient.nombre,
    rnc: apiClient.rnc_cedula,
    phone: apiClient.telefono || "",
    email: apiClient.correo || "",
    address: apiClient.direccion || "",
    // Determinar el tipo de facturación basado en datos disponibles
    // Usamos el campo tipo_facturacion que ahora viene de la API
    billingType:
      apiClient.tipo_facturacion?.toLowerCase() === "contado"
        ? "contado"
        : apiClient.tipo_facturacion?.toLowerCase() === "credito"
          ? "credito"
          : apiClient.tipo_facturacion?.toLowerCase() === "mixto"
            ? "mixto"
            : "contado",
    // Mapeo de tipo_ncf
    ncfType:
      apiClient.tipo_ncf === "01"
        ? "consumidor_final"
        : apiClient.tipo_ncf === "02"
          ? "credito_fiscal"
          : apiClient.tipo_ncf === "14"
            ? "gubernamental"
            : apiClient.tipo_ncf === "15"
              ? "regimen_especial"
              : "consumidor_final",
    // Usar el campo activo para establecer el estado
    status:
      apiClient.activo === true || apiClient.activo === "true"
        ? "activo"
        : "inactivo",
  };
};

// Adaptar el formato de la aplicación al formato de la API
const adaptClientToApi = (client: Partial<Client>): any => {
  // Verificar que EMPRESA_ID esté definido y sea un UUID válido
  if (!EMPRESA_ID) {
    throw new Error("La variable de entorno VITE_EMPRESA_ID no está definida");
  }

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      EMPRESA_ID
    )
  ) {
    throw new Error(
      "La variable de entorno VITE_EMPRESA_ID no es un UUID válido"
    );
  }

  const apiClient: any = {
    // Solo incluir estos campos si están presentes
    ...(client.name && { nombre: client.name }),
    ...(client.rnc && { rnc_cedula: validateRncCedula(client.rnc) }),
    ...(client.phone && { telefono: client.phone }),
    ...(client.email && { correo: client.email }),
    ...(client.address && { direccion: client.address }),
    // Siempre incluir el ID de empresa como UUID
    empresa_id: EMPRESA_ID,
  };

  // Mapear billingType a tipo_facturacion si está presente
  if (client.billingType) {
    apiClient.tipo_facturacion =
      client.billingType === "contado"
        ? "Contado"
        : client.billingType === "credito"
          ? "Credito"
          : "Mixto";
  }

  // Mapear ncfType a tipo_ncf si está presente
  if (client.ncfType) {
    apiClient.tipo_ncf =
      client.ncfType === "consumidor_final"
        ? "01"
        : client.ncfType === "credito_fiscal"
          ? "02"
          : client.ncfType === "gubernamental"
            ? "14"
            : client.ncfType === "regimen_especial"
              ? "15"
              : "01";
  }

  // Mapear status a activo si está presente
  if (client.status) {
    apiClient.activo = client.status === "activo";
  }

  // Log para depuración
  console.log("Datos adaptados para API:", apiClient);

  return apiClient;
};

export const clientService = {
  // Obtener todos los clientes (activos e inactivos)
  getAll: async (): Promise<Client[]> => {
    const token = logToken();
    if (!token) {
      console.error("No hay token disponible para la petición");
    }

    try {
      const response = await axiosInstance.get(clientEndpoint, {
        params: { incluir_inactivos: true },
      });
      console.log("Respuesta de API /clientes (todos):", response.data);

      // Verificar si realmente estamos recibiendo clientes inactivos
      const hasInactiveClients = response.data.some(
        (client: any) => client.activo === false
      );
      console.log(
        "¿Hay clientes inactivos en la respuesta?",
        hasInactiveClients
      );

      // Convertir cada cliente de la API al formato de la aplicación
      return response.data.map(adaptApiClient);
    } catch (error: any) {
      console.error(
        "Error al obtener clientes:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener solo clientes activos
  getActive: async (): Promise<Client[]> => {
    const token = logToken();
    if (!token) {
      console.error("No hay token disponible para la petición");
    }

    try {
      const response = await axiosInstance.get(clientEndpoint);
      console.log("Respuesta de API /clientes activos:", response.data);
      return response.data.map(adaptApiClient);
    } catch (error: any) {
      console.error(
        "Error al obtener clientes activos:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener un cliente por ID
  getById: async (id: string): Promise<Client> => {
    logToken();
    try {
      const response = await axiosInstance.get(`${clientEndpoint}/${id}`);
      return adaptApiClient(response.data);
    } catch (error: any) {
      console.error(
        `Error al obtener cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Crear un nuevo cliente
  create: async (client: Omit<Client, "id">): Promise<Client> => {
    logToken();

    // Verificar que EMPRESA_ID esté definido y sea un UUID válido
    if (!EMPRESA_ID) {
      throw new Error(
        "La variable de entorno VITE_EMPRESA_ID no está definida"
      );
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        EMPRESA_ID
      )
    ) {
      throw new Error(
        "La variable de entorno VITE_EMPRESA_ID no es un UUID válido"
      );
    }

    const apiClient = adaptClientToApi(client);

    try {
      console.log("Datos enviados a la API para crear cliente:", apiClient);
      const response = await axiosInstance.post(clientEndpoint, apiClient);
      return adaptApiClient(response.data);
    } catch (error: any) {
      console.error(
        "Error al crear cliente:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Actualizar un cliente existente
  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    logToken();

    // Verificar que EMPRESA_ID esté definido y sea un UUID válido
    if (!EMPRESA_ID) {
      throw new Error(
        "La variable de entorno VITE_EMPRESA_ID no está definida"
      );
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        EMPRESA_ID
      )
    ) {
      throw new Error(
        "La variable de entorno VITE_EMPRESA_ID no es un UUID válido"
      );
    }

    const apiClient = adaptClientToApi(client);

    try {
      console.log(
        `Datos enviados a la API para actualizar cliente ${id}:`,
        apiClient
      );
      const response = await axiosInstance.put(
        `${clientEndpoint}/${id}`,
        apiClient
      );
      return adaptApiClient(response.data);
    } catch (error: any) {
      console.error(
        `Error al actualizar cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Desactivar un cliente (anteriormente "delete")
  deactivate: async (id: string): Promise<void> => {
    logToken();
    try {
      // Usar el endpoint de delete, que internamente marca como inactivo
      await axiosInstance.delete(`${clientEndpoint}/${id}`);
    } catch (error: any) {
      console.error(
        `Error al desactivar cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Reactivar un cliente
  reactivate: async (id: string): Promise<Client> => {
    logToken();
    try {
      const response = await axiosInstance.put(
        `${clientEndpoint}/${id}/activate`,
        {
          activo: true,
          empresa_id: EMPRESA_ID, // Asegurar que empresa_id esté incluido
        }
      );
      return adaptApiClient(response.data);
    } catch (error: any) {
      console.error(
        `Error al reactivar cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Se mantiene el método "delete" para compatibilidad, pero redirige a deactivate
  delete: async (id: string): Promise<void> => {
    return clientService.deactivate(id);
  },
};
