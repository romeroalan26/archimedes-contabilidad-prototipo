import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Supplier } from "../types";
import { mockSuppliers } from "../purchasesData";

interface ProviderStore {
  providers: Supplier[];
  addProvider: (provider: Supplier) => void;
  updateProvider: (provider: Supplier) => void;
  getProviderById: (id: number) => Supplier | undefined;
}

export const useProviderStore = create<ProviderStore>()(
  persist(
    (set, get) => ({
      providers: mockSuppliers,
      addProvider: (provider) => {
        const newProvider = {
          ...provider,
          id: Math.max(0, ...get().providers.map((p) => p.id)) + 1,
        };
        set((state) => ({
          providers: [...state.providers, newProvider],
        }));
      },
      updateProvider: (provider) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === provider.id ? provider : p
          ),
        }));
      },
      getProviderById: (id) => {
        return get().providers.find((p) => p.id === id);
      },
    }),
    {
      name: "providers-storage",
    }
  )
);
