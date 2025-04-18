import { http, HttpResponse } from "msw";
import { Client } from "../features/sales/types";

const mockClients: Client[] = [
  {
    id: "1",
    name: "Empresa ABC",
    rnc: "101010101",
    phone: "809-555-1234",
    email: "contacto@empresaabc.com",
    billingType: "credito",
    ncfType: "fiscal",
  },
  {
    id: "2",
    name: "Comercial XYZ",
    rnc: "202020202",
    phone: "809-555-5678",
    email: "ventas@comercialxyz.com",
    billingType: "contado",
    ncfType: "final",
  },
];

export const handlers = [
  // GET /api/clients
  http.get("*/api/clients", () => {
    console.log("[MSW] GET /api/clients - Returning all clients");
    return HttpResponse.json(mockClients, { status: 200 });
  }),

  // GET /api/clients/:id
  http.get("*/api/clients/:id", ({ params }) => {
    console.log(`[MSW] GET /api/clients/${params.id} - Finding client`);
    const { id } = params;
    const client = mockClients.find((c) => c.id === id);

    if (!client) {
      console.log(`[MSW] Client with id ${id} not found`);
      return HttpResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return HttpResponse.json(client, { status: 200 });
  }),

  // POST /api/clients
  http.post("*/api/clients", async ({ request }) => {
    console.log("[MSW] POST /api/clients - Creating new client");
    try {
      const newClient = (await request.json()) as Omit<Client, "id">;
      console.log("[MSW] New client data:", newClient);

      const client: Client = {
        ...newClient,
        id: String(mockClients.length + 1),
      };

      mockClients.push(client);
      console.log("[MSW] Client created successfully:", client);

      return HttpResponse.json(client, { status: 201 });
    } catch (error) {
      console.error("[MSW] Error creating client:", error);
      return HttpResponse.json(
        { message: "Error al procesar la solicitud" },
        { status: 400 }
      );
    }
  }),

  // PUT /api/clients/:id
  http.put("*/api/clients/:id", async ({ params, request }) => {
    console.log(`[MSW] PUT /api/clients/${params.id} - Updating client`);
    try {
      const { id } = params;
      const updatedClient = (await request.json()) as Client;
      const index = mockClients.findIndex((c) => c.id === id);

      if (index === -1) {
        console.log(`[MSW] Client with id ${id} not found`);
        return HttpResponse.json(
          { message: "Cliente no encontrado" },
          { status: 404 }
        );
      }

      mockClients[index] = updatedClient;
      console.log("[MSW] Client updated successfully:", updatedClient);

      return HttpResponse.json(updatedClient, { status: 200 });
    } catch (error) {
      console.error("[MSW] Error updating client:", error);
      return HttpResponse.json(
        { message: "Error al procesar la solicitud" },
        { status: 400 }
      );
    }
  }),

  // DELETE /api/clients/:id
  http.delete("*/api/clients/:id", ({ params }) => {
    console.log(`[MSW] DELETE /api/clients/${params.id} - Deleting client`);
    const { id } = params;
    const index = mockClients.findIndex((c) => c.id === id);

    if (index === -1) {
      console.log(`[MSW] Client with id ${id} not found`);
      return HttpResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    mockClients.splice(index, 1);
    console.log(`[MSW] Client with id ${id} deleted successfully`);

    return new HttpResponse(null, { status: 204 });
  }),
];
