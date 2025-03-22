import {
  Product,
  InventoryMovement,
  Category,
  StockAlert,
  InventoryReport,
} from "./types";

export const mockProducts: Product[] = [
  {
    id: 1,
    codigo: "PROD001",
    nombre: "Laptop HP",
    descripcion: "Laptop HP 15.6 pulgadas",
    precio: 899.99,
    stock: 15,
    stockMinimo: 5,
    stockMaximo: 20,
    categoria: "Electrónicos",
    unidad: "unidad",
    estado: "activo",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    codigo: "PROD002",
    nombre: "Monitor Dell",
    descripcion: "Monitor Dell 24 pulgadas",
    precio: 299.99,
    stock: 8,
    stockMinimo: 3,
    stockMaximo: 15,
    categoria: "Electrónicos",
    unidad: "unidad",
    estado: "activo",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    codigo: "PROD003",
    nombre: "Teclado Mecánico",
    descripcion: "Teclado mecánico RGB",
    precio: 89.99,
    stock: 2,
    stockMinimo: 5,
    stockMaximo: 10,
    categoria: "Periféricos",
    unidad: "unidad",
    estado: "activo",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];

export const mockMovements: InventoryMovement[] = [
  {
    id: 1,
    productId: 1,
    tipo: "entrada",
    cantidad: 10,
    motivo: "Compra inicial",
    fecha: "2024-01-01",
    usuario: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    productId: 2,
    tipo: "entrada",
    cantidad: 5,
    motivo: "Compra inicial",
    fecha: "2024-01-02",
    usuario: "admin",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    productId: 3,
    tipo: "salida",
    cantidad: 3,
    motivo: "Venta",
    fecha: "2024-01-03",
    usuario: "admin",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

export const mockCategories: Category[] = [
  {
    id: 1,
    nombre: "Electrónicos",
    descripcion: "Productos electrónicos",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Periféricos",
    descripcion: "Periféricos de computadora",
    estado: "activo",
  },
];

export const mockStockAlerts: StockAlert[] = [
  {
    productId: 3,
    codigo: "PROD003",
    nombre: "Teclado Mecánico",
    stockActual: 2,
    stockMinimo: 5,
    diferencia: -3,
    estado: "critico",
  },
];

export const mockInventoryReport: InventoryReport = {
  totalProductos: 3,
  valorTotal: 3899.95,
  productosBajos: 1,
  productosCriticos: 1,
  movimientosRecientes: mockMovements,
  alertasStock: mockStockAlerts,
};
