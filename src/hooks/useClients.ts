import { useState, useEffect } from "react";
import { Client } from "../types/types";
import { clientService } from "../services/clients/clientService";
import { useAuth } from "../stores/authStore";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // ✅ Cargar clientes - Solo con token JWT
  const loadClients = async (incluirInactivos = true) => {
    if (!token) {
      setError("Token de autenticación requerido");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = incluirInactivos
        ? await clientService.getAll()
        : await clientService.getActive();

      setClients(data);
    } catch (err: any) {
      console.error("Error loading clients:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para acceder a los clientes.");
      } else {
        setError(err.message || "Error al cargar los clientes");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Crear cliente - Sin empresa_id, solo token JWT
  const createClient = async (
    clientData: Omit<Client, "id">
  ): Promise<Client | null> => {
    if (!token) {
      setError("Token de autenticación requerido");
      return null;
    }

    try {
      setError(null);
      const newClient = await clientService.create(clientData);
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (err: any) {
      console.error("Error creating client:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para crear clientes.");
      } else if (err.response?.status === 409) {
        setError("Ya existe un cliente con ese nombre y RNC en esta empresa.");
      } else {
        setError(err.message || "Error al crear el cliente");
      }
      throw err;
    }
  };

  // ✅ Actualizar cliente - Sin empresa_id, solo token JWT
  const updateClient = async (
    clientId: string,
    clientData: Partial<Client>
  ): Promise<Client | null> => {
    if (!token) {
      setError("Token de autenticación requerido");
      return null;
    }

    try {
      setError(null);
      const updatedClient = await clientService.update(clientId, clientData);
      setClients((prev) =>
        prev.map((client) => (client.id === clientId ? updatedClient : client))
      );
      return updatedClient;
    } catch (err: any) {
      console.error("Error updating client:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para actualizar este cliente.");
      } else if (err.response?.status === 404) {
        setError("Cliente no encontrado.");
      } else {
        setError(err.message || "Error al actualizar el cliente");
      }
      throw err;
    }
  };

  // ✅ Desactivar cliente - Solo token JWT
  const deactivateClient = async (clientId: string): Promise<void> => {
    if (!token) {
      setError("Token de autenticación requerido");
      return;
    }

    try {
      setError(null);
      await clientService.deactivate(clientId);
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId
            ? { ...client, status: "inactivo" as const }
            : client
        )
      );
    } catch (err: any) {
      console.error("Error deactivating client:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para desactivar este cliente.");
      } else if (err.response?.status === 404) {
        setError("Cliente no encontrado.");
      } else {
        setError(err.message || "Error al desactivar el cliente");
      }
      throw err;
    }
  };

  // ✅ Reactivar cliente - Solo token JWT
  const reactivateClient = async (clientId: string): Promise<Client | null> => {
    if (!token) {
      setError("Token de autenticación requerido");
      return null;
    }

    try {
      setError(null);
      const reactivatedClient = await clientService.reactivate(clientId);
      setClients((prev) =>
        prev.map((client) =>
          client.id === clientId ? reactivatedClient : client
        )
      );
      return reactivatedClient;
    } catch (err: any) {
      console.error("Error reactivating client:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para reactivar este cliente.");
      } else if (err.response?.status === 404) {
        setError("Cliente no encontrado.");
      } else {
        setError(err.message || "Error al reactivar el cliente");
      }
      throw err;
    }
  };

  // ✅ Obtener cliente por ID - Solo token JWT
  const getClientById = async (clientId: string): Promise<Client | null> => {
    if (!token) {
      setError("Token de autenticación requerido");
      return null;
    }

    try {
      setError(null);
      const client = await clientService.getById(clientId);
      return client;
    } catch (err: any) {
      console.error("Error fetching client:", err);

      if (err.response?.status === 401) {
        setError("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
      } else if (err.response?.status === 403) {
        setError("No tiene permisos para acceder a este cliente.");
      } else if (err.response?.status === 404) {
        setError("Cliente no encontrado.");
      } else {
        setError(err.message || "Error al obtener el cliente");
      }
      return null;
    }
  };

  // Cargar clientes automáticamente cuando hay token
  useEffect(() => {
    if (token) {
      loadClients();
    }
  }, [token]);

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
    updateClient,
    deactivateClient,
    reactivateClient,
    getClientById,
    clearError: () => setError(null),
  };
};
