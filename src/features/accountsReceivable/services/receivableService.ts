import {
  Receivable,
  CreateReceivableDTO,
  UpdateReceivableDTO,
  CustomerReceivableStatus,
} from "../types";

// TODO: Replace with actual API client
const API_BASE_URL = "/api/receivables";

export const receivableService = {
  list: async (): Promise<Receivable[]> => {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) throw new Error("Failed to fetch receivables");
    return response.json();
  },

  getById: async (id: number): Promise<Receivable> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch receivable");
    return response.json();
  },

  create: async (data: CreateReceivableDTO): Promise<Receivable> => {
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create receivable");
    return response.json();
  },

  update: async (
    id: number,
    data: UpdateReceivableDTO
  ): Promise<Receivable> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update receivable");
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete receivable");
  },

  getStatus: async (customerId: number): Promise<CustomerReceivableStatus> => {
    const response = await fetch(`${API_BASE_URL}/status/${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch receivable status");
    return response.json();
  },
};
