import { create } from "zustand";
import { Sale } from "../features/sales/types";

type SalesStore = {
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id">) => void;
  updateSale: (sale: Sale) => void;
  removeSale: (id: string) => void;
};

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  addSale: (sale) =>
    set((state) => ({
      sales: [...state.sales, { ...sale, id: crypto.randomUUID() }],
    })),
  updateSale: (sale) =>
    set((state) => ({
      sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
    })),
  removeSale: (id) =>
    set((state) => ({
      sales: state.sales.filter((s) => s.id !== id),
    })),
}));
