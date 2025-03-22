export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  categoria: string;
  unidad: string;
  estado: "activo" | "inactivo";
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  nombre: string;
  codigo: string;
  estado: "activo" | "completado" | "pausado";
  fechaInicio: string;
  fechaFin: string;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  motivo: string;
  fecha: string;
  usuario: string;
  createdAt: string;
}

export interface InventoryAssignment {
  id: number;
  projectId: number;
  productId: number;
  cantidad: number;
  fecha: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  usuario: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "activo" | "inactivo";
}

export interface StockAlert {
  productId: number;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  estado: "bajo" | "critico";
}

export interface InventoryReport {
  totalProductos: number;
  valorTotal: number;
  productosBajos: number;
  productosCriticos: number;
  movimientosRecientes: InventoryMovement[];
  alertasStock: StockAlert[];
}
