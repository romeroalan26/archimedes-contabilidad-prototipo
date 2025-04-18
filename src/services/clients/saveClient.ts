import { Client } from "../../types/types";

export async function saveClient(
  client: Client,
  isEdit: boolean
): Promise<Client> {
  // Simulación de API hasta que esté disponible
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
    billingType: client.billingType,
    ncfType: client.ncfType,
  };

  console.log("Cliente simulado guardado:", savedClient);

  // Devolver el cliente como si hubiera sido guardado por la API
  return savedClient;

  // Código original para cuando la API esté disponible
  /*
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
    console.error("Error saving client:", error);
    throw error;
  }
  */
}
