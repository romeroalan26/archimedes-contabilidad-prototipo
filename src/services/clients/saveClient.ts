import { Client } from "../../features/sales/types";

/**
 * Guarda un cliente en la API (crea uno nuevo o actualiza uno existente)
 * @param client Datos del cliente a guardar
 * @param isEdit Indica si es una actualización (true) o creación (false)
 * @returns Promise con la respuesta de la API
 */
export async function saveClient(
  client: Client,
  isEdit: boolean
): Promise<Client> {
  const endpoint = isEdit ? `/api/clients/${client.id}` : "/api/clients";
  const method = isEdit ? "PUT" : "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al guardar el cliente");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al guardar el cliente:", error);
    throw error;
  }
}
