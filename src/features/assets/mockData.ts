import { Asset } from "./types";

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Computadora Dell XPS",
    description: "Computadora de escritorio para contabilidad",
    category: "Equipos de Oficina",
    acquisitionDate: "2023-01-15",
    originalValue: 1200,
    usefulLife: 5,
    currentValue: 960,
    depreciationRate: 20,
    status: "active",
  },
  {
    id: "2",
    name: "Impresora HP LaserJet",
    description: "Impresora láser para documentos",
    category: "Equipos de Oficina",
    acquisitionDate: "2023-03-20",
    originalValue: 800,
    usefulLife: 5,
    currentValue: 640,
    depreciationRate: 20,
    status: "active",
  },
  {
    id: "3",
    name: "Muebles de Oficina",
    description: "Conjunto de escritorios y sillas",
    category: "Mobiliario",
    acquisitionDate: "2023-06-10",
    originalValue: 5000,
    usefulLife: 10,
    currentValue: 4500,
    depreciationRate: 20,
    status: "active",
  },
];

export const assetCategories = [
  "Equipos de Oficina",
  "Mobiliario",
  "Vehiculos",
  "Maquinaria",
  "Edificios",
  "Otros",
];
