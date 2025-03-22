import { Asset } from "./types";

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Computadora Dell XPS",
    description: "Computadora de escritorio para contabilidad",
    category: "equipment",
    acquisitionDate: "2023-01-15",
    originalValue: 1200,
    usefulLife: 5,
    currentValue: 960,
    depreciationRate: 20,
    status: "active",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Impresora HP LaserJet",
    description: "Impresora láser para documentos",
    category: "equipment",
    acquisitionDate: "2023-03-20",
    originalValue: 800,
    usefulLife: 5,
    currentValue: 640,
    depreciationRate: 20,
    status: "active",
    createdAt: "2023-03-20T00:00:00Z",
    updatedAt: "2023-03-20T00:00:00Z",
  },
  {
    id: "3",
    name: "Muebles de Oficina",
    description: "Conjunto de escritorios y sillas",
    category: "furniture",
    acquisitionDate: "2023-06-10",
    originalValue: 5000,
    usefulLife: 10,
    currentValue: 4500,
    depreciationRate: 20,
    status: "active",
    createdAt: "2023-06-10T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
  },
];

export const assetCategories = [
  "equipment",
  "furniture",
  "vehicles",
  "buildings",
  "other",
];
