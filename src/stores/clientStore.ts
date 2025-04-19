import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client } from "../types/types";
import { mockClients } from "../features/sales/salesData";

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

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
      name: "client-storage",
    }
  )
);
