import axiosInstance from "../axiosConfig";
import { Client } from "../../types/types";
import { useAuth } from "../../stores/authStore";

const clientEndpoint = "/clientes";

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
  try {
    const token = useAuth.getState().token;
    console.log(
      "Token disponible:",
      !!token,
      token ? `${token.substring(0, 15)}...` : "No hay token"
    );
    return token;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
};

// Adaptar el formato de la API al formato de la aplicación
const adaptApiClient = (apiClient: any): Client => {
  // Log para depuración
  console.log("Adaptando datos de API:", apiClient);

  // Verificar que los datos básicos existan
  if (!apiClient) {
    throw new Error("Datos de cliente inválidos: objeto vacío o null");
  }

  if (!apiClient.cliente_id) {
    throw new Error("Datos de cliente inválidos: falta ID");
  }

  return {
    id: String(apiClient.cliente_id),
    name: String(apiClient.nombre || ""),
    rnc: String(apiClient.rnc_cedula || ""),
    phone: String(apiClient.telefono || ""),
    email: String(apiClient.correo || ""),
    address: String(apiClient.direccion || ""),
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
// ✅ Eliminado empresa_id - se toma automáticamente del token JWT
const adaptClientToApi = (client: Partial<Client>): any => {
  const apiClient: any = {
    // Solo incluir estos campos si están presentes
    ...(client.name && { nombre: client.name }),
    ...(client.rnc && { rnc_cedula: validateRncCedula(client.rnc) }),
    ...(client.phone && { telefono: client.phone }),
    ...(client.email && { correo: client.email }),
    ...(client.address && { direccion: client.address }),
    // ✅ REMOVED: empresa_id - el backend lo toma del token JWT automáticamente
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

// Función para extraer los datos de clientes de diferentes estructuras de respuesta
const extractClientsFromResponse = (responseData: any): any[] => {
  console.log("Extrayendo clientes de respuesta:", responseData);
  console.log("Tipo de responseData:", typeof responseData);
  console.log("Es array responseData:", Array.isArray(responseData));

  if (!responseData) {
    throw new Error("Respuesta vacía del servidor");
  }

  // Caso 1: Respuesta directa como array
  if (Array.isArray(responseData)) {
    console.log("✅ Estructura: Array directo");
    return responseData;
  }

  // Caso 2: Objeto con propiedad 'data'
  if (responseData.data && Array.isArray(responseData.data)) {
    console.log("✅ Estructura: { data: [...] }");
    return responseData.data;
  }

  // Caso 3: Objeto con propiedad 'clientes'
  if (responseData.clientes && Array.isArray(responseData.clientes)) {
    console.log("✅ Estructura: { clientes: [...] }");
    return responseData.clientes;
  }

  // Caso 4: Objeto con propiedad 'result'
  if (responseData.result && Array.isArray(responseData.result)) {
    console.log("✅ Estructura: { result: [...] }");
    return responseData.result;
  }

  // Caso 5: Objeto con propiedad 'items'
  if (responseData.items && Array.isArray(responseData.items)) {
    console.log("✅ Estructura: { items: [...] }");
    return responseData.items;
  }

  // Caso 6: Si no hay clientes, devolver array vacío
  if (
    responseData.message &&
    responseData.message.includes("no") &&
    responseData.message.includes("clientes")
  ) {
    console.log("✅ Mensaje: No hay clientes");
    return [];
  }

  // Caso 7: Verificar si es un objeto con propiedades que parecen de cliente
  if (typeof responseData === "object" && responseData.cliente_id) {
    console.log("✅ Estructura: Cliente único, convirtiendo a array");
    return [responseData];
  }

  // Si llegamos aquí, no pudimos identificar la estructura
  console.error("❌ Estructura de respuesta no reconocida");
  console.error("Propiedades disponibles:", Object.keys(responseData));
  console.error("Contenido completo:", responseData);

  throw new Error(
    `Formato de respuesta no reconocido. Propiedades: ${Object.keys(responseData).join(", ")}`
  );
};

export const clientService = {
  // 🧪 Función de prueba para debuggear la API
  test: async () => {
    console.log("=== TEST CLIENTE API ===");
    try {
      const token = logToken();
      console.log("Token disponible:", !!token);

      if (!token) {
        console.error("❌ No hay token disponible");
        return;
      }

      // Hacer petición directa sin parámetros
      console.log("🔍 Probando GET /clientes sin parámetros...");
      const response1 = await axiosInstance.get(clientEndpoint);
      console.log("Respuesta 1 (sin params):", response1.data);

      // Hacer petición con parámetros
      console.log("🔍 Probando GET /clientes con incluir_inactivos=true...");
      const response2 = await axiosInstance.get(clientEndpoint, {
        params: { incluir_inactivos: true },
      });
      console.log("Respuesta 2 (con params):", response2.data);
    } catch (error: any) {
      console.error("❌ Error en test:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
    }
    console.log("=======================");
  },

  // ✅ GET - Obtener todos los clientes (activos e inactivos)
  // Solo usa token JWT, sin query params de empresa
  getAll: async (): Promise<Client[]> => {
    const token = logToken();
    if (!token) {
      console.error("No hay token disponible para la petición");
      throw new Error("Token de autenticación requerido");
    }

    try {
      const response = await axiosInstance.get(clientEndpoint, {
        params: { incluir_inactivos: true },
      });

      console.log("=== RESPONSE GETALL ===");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data completa:", response.data);
      console.log("=====================");

      // Extraer los datos de clientes usando la función utilitaria
      const clientsData = extractClientsFromResponse(response.data);

      console.log("Datos de clientes extraídos:", clientsData);
      console.log("Número de clientes:", clientsData.length);

      // Verificar si realmente estamos recibiendo clientes inactivos
      const hasInactiveClients = clientsData.some(
        (client: any) => client.activo === false
      );
      console.log(
        "¿Hay clientes inactivos en la respuesta?",
        hasInactiveClients
      );

      // Convertir cada cliente de la API al formato de la aplicación
      try {
        return clientsData.map(adaptApiClient);
      } catch (adaptError) {
        console.error("Error al adaptar datos de clientes:", adaptError);
        console.error("Datos que causaron el error:", clientsData);
        throw new Error("Error al procesar datos de clientes");
      }
    } catch (error: any) {
      console.error(
        "Error al obtener clientes:",
        error.response?.status,
        error.response?.data || error.message
      );

      // Re-lanzar con información más específica
      if (error.response?.status === 401) {
        throw new Error("Token de autenticación inválido o expirado");
      } else if (error.response?.status === 403) {
        throw new Error("No tiene permisos para acceder a los clientes");
      } else if (error.response?.status === 500) {
        throw new Error("Error interno del servidor");
      } else if (error.message.includes("Network Error")) {
        throw new Error("Error de conexión con el servidor");
      }

      throw error;
    }
  },

  // ✅ GET - Obtener solo clientes activos
  // Solo usa token JWT, el backend filtra automáticamente por empresa
  getActive: async (): Promise<Client[]> => {
    const token = logToken();
    if (!token) {
      console.error("No hay token disponible para la petición");
      throw new Error("Token de autenticación requerido");
    }

    try {
      const response = await axiosInstance.get(clientEndpoint);

      console.log("=== RESPONSE GETACTIVE ===");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data completa:", response.data);
      console.log("=========================");

      // Extraer los datos de clientes usando la función utilitaria
      const clientsData = extractClientsFromResponse(response.data);

      console.log("Datos de clientes activos extraídos:", clientsData);
      console.log("Número de clientes activos:", clientsData.length);

      try {
        return clientsData.map(adaptApiClient);
      } catch (adaptError) {
        console.error(
          "Error al adaptar datos de clientes activos:",
          adaptError
        );
        console.error("Datos que causaron el error:", clientsData);
        throw new Error("Error al procesar datos de clientes activos");
      }
    } catch (error: any) {
      console.error(
        "Error al obtener clientes activos:",
        error.response?.status,
        error.response?.data || error.message
      );

      // Re-lanzar con información más específica
      if (error.response?.status === 401) {
        throw new Error("Token de autenticación inválido o expirado");
      } else if (error.response?.status === 403) {
        throw new Error("No tiene permisos para acceder a los clientes");
      } else if (error.response?.status === 500) {
        throw new Error("Error interno del servidor");
      } else if (error.message.includes("Network Error")) {
        throw new Error("Error de conexión con el servidor");
      }

      throw error;
    }
  },

  // ✅ GET por ID - Solo token JWT
  // El backend valida que el cliente pertenezca a la empresa del token
  getById: async (id: string): Promise<Client> => {
    const token = logToken();
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    try {
      const response = await axiosInstance.get(`${clientEndpoint}/${id}`);

      console.log("=== RESPONSE GETBYID ===");
      console.log("Status:", response.status);
      console.log("Data completa:", response.data);
      console.log("========================");

      // Verificar que la respuesta sea válida
      if (!response.data) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Extraer los datos del cliente
      let clientData;

      if (response.data.cliente) {
        // Estructura: { cliente: { ... } }
        console.log("✅ Estructura GETBYID: { cliente: {...} }");
        clientData = response.data.cliente;
      } else if (response.data.data) {
        // Estructura: { data: { ... } }
        console.log("✅ Estructura GETBYID: { data: {...} }");
        clientData = response.data.data;
      } else if (response.data.cliente_id) {
        // Estructura: datos directos del cliente
        console.log("✅ Estructura GETBYID: datos directos");
        clientData = response.data;
      } else {
        console.error(
          "❌ Estructura de respuesta GETBYID no reconocida:",
          response.data
        );
        throw new Error("Formato de respuesta no reconocido");
      }

      console.log("Datos del cliente extraídos:", clientData);

      return adaptApiClient(clientData);
    } catch (error: any) {
      console.error(
        `Error al obtener cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ POST - Crear un nuevo cliente
  // Sin empresa_id en el body - se toma del token JWT automáticamente
  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const token = logToken();
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    // ✅ Datos limpios sin empresa_id - se maneja automáticamente en backend
    const apiClient = adaptClientToApi(client);

    try {
      console.log("Datos enviados a la API para crear cliente:", apiClient);
      const response = await axiosInstance.post(clientEndpoint, apiClient);

      console.log("=== RESPONSE CREATE ===");
      console.log("Status:", response.status);
      console.log("Data completa:", response.data);
      console.log("======================");

      // Verificar que la respuesta sea válida
      if (!response.data) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Extraer los datos del cliente creado
      let clientData;

      if (response.data.cliente) {
        // Estructura: { mensaje: "...", cliente: { ... } }
        console.log("✅ Estructura CREATE: { cliente: {...} }");
        clientData = response.data.cliente;
      } else if (response.data.data) {
        // Estructura: { data: { ... } }
        console.log("✅ Estructura CREATE: { data: {...} }");
        clientData = response.data.data;
      } else if (response.data.cliente_id) {
        // Estructura: datos directos del cliente
        console.log("✅ Estructura CREATE: datos directos");
        clientData = response.data;
      } else {
        console.error(
          "❌ Estructura de respuesta CREATE no reconocida:",
          response.data
        );
        throw new Error("Formato de respuesta de creación no reconocido");
      }

      console.log("Datos del cliente extraídos:", clientData);

      return adaptApiClient(clientData);
    } catch (error: any) {
      console.error(
        "Error al crear cliente:",
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ PUT - Actualizar un cliente existente
  // Sin empresa_id - se maneja automáticamente
  update: async (id: string, client: Partial<Client>): Promise<Client> => {
    const token = logToken();
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    // ✅ Datos limpios sin empresa_id
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

      console.log("=== RESPONSE UPDATE ===");
      console.log("Status:", response.status);
      console.log("Data completa:", response.data);
      console.log("======================");

      // Verificar que la respuesta sea válida
      if (!response.data) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Extraer los datos del cliente actualizado
      let clientData;

      if (response.data.cliente) {
        // Estructura: { mensaje: "...", cliente: { ... } }
        console.log("✅ Estructura UPDATE: { cliente: {...} }");
        clientData = response.data.cliente;
      } else if (response.data.data) {
        // Estructura: { data: { ... } }
        console.log("✅ Estructura UPDATE: { data: {...} }");
        clientData = response.data.data;
      } else if (response.data.cliente_id) {
        // Estructura: datos directos del cliente
        console.log("✅ Estructura UPDATE: datos directos");
        clientData = response.data;
      } else {
        console.error(
          "❌ Estructura de respuesta UPDATE no reconocida:",
          response.data
        );
        throw new Error("Formato de respuesta de actualización no reconocido");
      }

      console.log("Datos del cliente actualizado extraídos:", clientData);

      return adaptApiClient(clientData);
    } catch (error: any) {
      console.error(
        `Error al actualizar cliente ${id}:`,
        error.response?.status,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // ✅ DELETE - Desactivar un cliente
  // Solo token JWT, el backend valida permisos automáticamente
  deactivate: async (id: string): Promise<void> => {
    const token = logToken();
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

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

  // ✅ PUT - Reactivar un cliente
  // Sin empresa_id en el body - se maneja automáticamente
  reactivate: async (id: string): Promise<Client> => {
    const token = logToken();
    if (!token) {
      throw new Error("Token de autenticación requerido");
    }

    try {
      const response = await axiosInstance.put(
        `${clientEndpoint}/${id}/activate`,
        {
          activo: true,
          // ✅ REMOVED: empresa_id - se toma del token automáticamente
        }
      );

      console.log("=== RESPONSE REACTIVATE ===");
      console.log("Status:", response.status);
      console.log("Data completa:", response.data);
      console.log("===========================");

      // Verificar que la respuesta sea válida
      if (!response.data) {
        throw new Error("Respuesta vacía del servidor");
      }

      // Extraer los datos del cliente reactivado
      let clientData;

      if (response.data.cliente) {
        // Estructura: { mensaje: "...", cliente: { ... } }
        console.log("✅ Estructura REACTIVATE: { cliente: {...} }");
        clientData = response.data.cliente;
      } else if (response.data.data) {
        // Estructura: { data: { ... } }
        console.log("✅ Estructura REACTIVATE: { data: {...} }");
        clientData = response.data.data;
      } else if (response.data.cliente_id) {
        // Estructura: datos directos del cliente
        console.log("✅ Estructura REACTIVATE: datos directos");
        clientData = response.data;
      } else {
        console.error(
          "❌ Estructura de respuesta REACTIVATE no reconocida:",
          response.data
        );
        throw new Error("Formato de respuesta de reactivación no reconocido");
      }

      console.log("Datos del cliente reactivado extraídos:", clientData);

      return adaptApiClient(clientData);
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
