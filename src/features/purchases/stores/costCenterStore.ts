import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CostCenter {
  id: number;
  codigo: string;
  nombre: string;
  tipo: "activo" | "pasivo" | "capital" | "ingreso" | "egreso";
  saldo: number;
}

// Mock cost centers data
const mockCostCenters: CostCenter[] = [
  {
    id: 1,
    codigo: "CC-001",
    nombre: "Oficina Central",
    tipo: "egreso",
    saldo: 50000,
  },
  {
    id: 2,
    codigo: "CC-002",
    nombre: "Proyecto Hospital Regional",
    tipo: "egreso",
    saldo: 150000,
  },
  {
    id: 3,
    codigo: "CC-003",
    nombre: "Proyecto Escuela Primaria",
    tipo: "egreso",
    saldo: 75000,
  },
  {
    id: 4,
    codigo: "CC-004",
    nombre: "Mantenimiento",
    tipo: "egreso",
    saldo: 25000,
  },
];

interface CostCenterStore {
  costCenters: CostCenter[];
  addCostCenter: (costCenter: CostCenter) => void;
  updateCostCenter: (costCenter: CostCenter) => void;
  getCostCenterById: (id: number) => CostCenter | undefined;
}

export const useCostCenterStore = create<CostCenterStore>()(
  persist(
    (set, get) => ({
      costCenters: mockCostCenters,
      addCostCenter: (costCenter) => {
        const newCostCenter = {
          ...costCenter,
          id: Math.max(0, ...get().costCenters.map((c) => c.id)) + 1,
        };
        set((state) => ({
          costCenters: [...state.costCenters, newCostCenter],
        }));
      },
      updateCostCenter: (costCenter) => {
        set((state) => ({
          costCenters: state.costCenters.map((c) =>
            c.id === costCenter.id ? costCenter : c
          ),
        }));
      },
      getCostCenterById: (id) => {
        return get().costCenters.find((c) => c.id === id);
      },
    }),
    {
      name: "cost-centers-storage",
    }
  )
);
