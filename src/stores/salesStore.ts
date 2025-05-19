import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Sale } from "../features/sales/types";

type SalesStore = {
  sales: Sale[];
  addSale: (sale: Omit<Sale, "id">) => void;
  updateSale: (sale: Sale) => void;
  removeSale: (id: string) => void;
};

export const useSalesStore = create<SalesStore>()(
  persist(
    (set) => ({
      sales: [],

      addSale: (saleData) => {
        const newSale: Sale = {
          ...saleData,
          id: crypto.randomUUID(),
          payments: [],
          totalPaid:
            saleData.type === "cash"
              ? saleData.total
              : saleData.advancePayment || 0,
          remainingBalance:
            saleData.type === "cash"
              ? 0
              : saleData.total - (saleData.advancePayment || 0),
          status:
            saleData.type === "cash"
              ? "completed"
              : saleData.advancePayment && saleData.advancePayment > 0
                ? "partial"
                : "pending",
        };
        set((state) => ({ sales: [...state.sales, newSale] }));
      },

      updateSale: (updatedSale) => {
        set((state) => ({
          sales: state.sales.map((sale) =>
            sale.id === updatedSale.id ? updatedSale : sale
          ),
        }));
      },

      removeSale: (id) => {
        set((state) => ({
          sales: state.sales.filter((sale) => sale.id !== id),
        }));
      },
    }),
    {
      name: "sales-storage",
    }
  )
);
