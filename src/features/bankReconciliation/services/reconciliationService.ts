import {
  Reconciliation,
  CreateReconciliationDTO,
  UpdateReconciliationDTO,
  ReconciliationFilters,
} from "../types";

// TODO: Replace with actual API endpoints
const API_BASE_URL = "/api/reconciliations";

// Mock data for development
const mockReconciliations: Reconciliation[] = [
  {
    id: "1",
    bankId: "BAN001",
    month: 3,
    year: 2024,
    bankBalance: 50000,
    movements: [],
    reconciledBalance: 50000,
    difference: 0,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const reconciliationService = {
  // TODO: Replace with actual API calls
  async getReconciliations(
    filters?: ReconciliationFilters
  ): Promise<Reconciliation[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockReconciliations];
        if (filters) {
          if (filters.bankId) {
            filtered = filtered.filter((r) => r.bankId === filters.bankId);
          }
          if (filters.month) {
            filtered = filtered.filter((r) => r.month === filters.month);
          }
          if (filters.year) {
            filtered = filtered.filter((r) => r.year === filters.year);
          }
          if (filters.status) {
            filtered = filtered.filter((r) => r.status === filters.status);
          }
        }
        resolve(filtered);
      }, 500);
    });
  },

  async getReconciliationById(id: string): Promise<Reconciliation | null> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const reconciliation = mockReconciliations.find((r) => r.id === id);
        resolve(reconciliation || null);
      }, 500);
    });
  },

  async createReconciliation(
    data: CreateReconciliationDTO
  ): Promise<Reconciliation> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReconciliation: Reconciliation = {
          id: String(mockReconciliations.length + 1),
          ...data,
          movements: [],
          reconciledBalance: data.bankBalance,
          difference: 0,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockReconciliations.push(newReconciliation);
        resolve(newReconciliation);
      }, 500);
    });
  },

  async updateReconciliation(
    id: string,
    data: UpdateReconciliationDTO
  ): Promise<Reconciliation> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockReconciliations.findIndex((r) => r.id === id);
        if (index === -1) {
          throw new Error("Reconciliation not found");
        }

        const updatedReconciliation = {
          ...mockReconciliations[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        mockReconciliations[index] = updatedReconciliation;
        resolve(updatedReconciliation);
      }, 500);
    });
  },

  async deleteReconciliation(id: string): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockReconciliations.findIndex((r) => r.id === id);
        if (index !== -1) {
          mockReconciliations.splice(index, 1);
        }
        resolve();
      }, 500);
    });
  },
};
