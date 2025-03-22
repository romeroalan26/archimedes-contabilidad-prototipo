import {
  Product,
  Project,
  InventoryMovement,
  InventoryAssignment,
  Category,
  StockAlert,
  InventoryReport,
} from "./types";

export const mockProducts: Product[] = [
  {
    id: 1,
    nombre: "Bloques",
    unidad: "unidad",
    stock: 800,
    stockMinimo: 100,
    stockMaximo: 1000,
    categoria: "Materiales de Construcción",
    codigo: "BLK-001",
    descripcion: "Bloques de concreto para construcción",
    precio: 2.5,
    estado: "activo",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    nombre: "Cemento",
    unidad: "saco",
    stock: 200,
    stockMinimo: 50,
    stockMaximo: 300,
    categoria: "Materiales de Construcción",
    codigo: "CEM-001",
    descripcion: "Cemento Portland tipo I",
    precio: 25.0,
    estado: "activo",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    nombre: "Obra Hospital Regional",
    codigo: "HOSP-001",
    estado: "activo",
    fechaInicio: "2024-01-15",
    fechaFin: "2024-12-31",
  },
  {
    id: 2,
    nombre: "Construcción de Puente",
    codigo: "PUEN-001",
    estado: "activo",
    fechaInicio: "2024-02-01",
    fechaFin: "2024-08-31",
  },
];

export const mockMovements: InventoryMovement[] = [
  {
    id: 1,
    productId: 1,
    tipo: "entrada",
    cantidad: 200,
    fecha: "2024-03-15",
    motivo: "Compra regular",
    usuario: "admin",
    createdAt: "2024-03-15T00:00:00Z",
  },
  {
    id: 2,
    productId: 2,
    tipo: "salida",
    cantidad: 50,
    fecha: "2024-03-16",
    motivo: "Uso en obra",
    usuario: "admin",
    createdAt: "2024-03-16T00:00:00Z",
  },
];

export const mockAssignments: InventoryAssignment[] = [
  {
    id: 1,
    projectId: 1,
    productId: 1,
    cantidad: 200,
    fecha: "2024-03-15",
    estado: "aprobada",
    usuario: "admin",
  },
  {
    id: 2,
    projectId: 2,
    productId: 2,
    cantidad: 50,
    fecha: "2024-03-16",
    estado: "pendiente",
    usuario: "admin",
  },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    nombre: "Materiales de Construcción",
    descripcion: "Materiales básicos para construcción",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Herramientas",
    descripcion: "Herramientas y equipos",
    estado: "activo",
  },
];

export const mockStockAlerts: StockAlert[] = [
  {
    productId: 3,
    codigo: "VAR-001",
    nombre: "Varilla",
    stockActual: 2,
    stockMinimo: 5,
    diferencia: -3,
    estado: "critico",
  },
];

export const mockInventoryReport: InventoryReport = {
  totalProductos: 4,
  valorTotal: 15000,
  productosBajos: 1,
  productosCriticos: 1,
  movimientosRecientes: mockMovements.slice(0, 5),
  alertasStock: mockStockAlerts,
};
