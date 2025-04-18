import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client } from "../features/sales/types";

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

// Datos mock iniciales
const mockClients: Client[] = [
  {
    id: "1",
    name: "Constructora del Caribe",
    rnc: "101234567",
    phone: "809-555-0123",
    email: "info@constructora.com",
    billingType: "credito",
    ncfType: "fiscal",
  },
  {
    id: "2",
    name: "Obras y Servicios SRL",
    rnc: "102345678",
    phone: "809-555-0124",
    email: "contacto@obrasyservicios.com",
    billingType: "contado",
    ncfType: "final",
  },
  {
    id: "3",
    name: "Grupo Metálico RD",
    rnc: "103456789",
    phone: "809-555-0125",
    email: "ventas@grupometalico.com",
    billingType: "mixto",
    ncfType: "fiscal",
  },
];

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: mockClients,
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client],
        })),
      updateClient: (updatedClient) =>
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === updatedClient.id ? updatedClient : c
          ),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "client-storage", // nombre para la clave en localStorage
    }
  )
);
