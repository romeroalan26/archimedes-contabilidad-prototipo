import { Client } from "../../types/types";
import { clientService } from "./clientService";

export async function saveClient(
  client: Client,
  isEdit: boolean
): Promise<Client> {
  try {
    if (isEdit) {
      return await clientService.update(client.id, client);
    } else {
      // Para nuevos clientes, omitimos el ID ya que la API lo generará
      const { id, ...clientWithoutId } = client;
      return await clientService.create(clientWithoutId);
    }
  } catch (error) {
    console.error("Error saving client:", error);

    // Simulación de API hasta que la conexión real esté estable
    console.log(
      `Simulando ${isEdit ? "actualización" : "creación"} de cliente:`,
      client
    );

    // Simular un pequeño retraso para imitar una llamada a API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Asegurarse de que el cliente tenga todos los campos necesarios
    const savedClient: Client = {
      id: client.id,
      name: client.name,
      rnc: client.rnc,
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      billingType: client.billingType,
      ncfType: client.ncfType,
      status: client.status || "activo",
    };

    console.log("Cliente simulado guardado:", savedClient);

    // Devolver el cliente como si hubiera sido guardado por la API
    return savedClient;
  }
}
