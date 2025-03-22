import { Sale } from "../types";

// TODO: Replace with actual API endpoints
const API_BASE_URL = "/api/sales";

export const salesService = {
  createSale: async (sale: Omit<Sale, "id">): Promise<Sale> => {
    // TODO: Replace with actual API call
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    });
    if (!response.ok) throw new Error("Failed to create sale");
    return response.json();
  },

  getSalesList: async (): Promise<Sale[]> => {
    // TODO: Replace with actual API call
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch sales");
    return response.json();
  },

  getSaleById: async (id: number): Promise<Sale> => {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch sale");
    return response.json();
  },

  updateSale: async (id: number, sale: Partial<Sale>): Promise<Sale> => {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    });
    if (!response.ok) throw new Error("Failed to update sale");
    return response.json();
  },

  deleteSale: async (id: number): Promise<void> => {
    // TODO: Replace with actual API call
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete sale");
  },
};
