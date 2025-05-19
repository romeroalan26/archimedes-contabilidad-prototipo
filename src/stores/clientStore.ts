import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client } from "../types/types";

interface ClientStore {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: [],
      setClients: (clients) => set({ clients }),
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
