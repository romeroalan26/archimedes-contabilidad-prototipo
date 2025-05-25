export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  unidad: string;
  ubicacion: string;
  estado: "activo" | "inactivo";
  fechaCreacion: string;
  fechaActualizacion: string;
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
  tipo: "entrada" | "salida" | "ajuste";
  cantidad: number;
  precioUnitario: number;
  motivo: string;
  referencia: string;
  fecha: string;
  usuario: string;
  fechaCreacion: string;
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
  codigo: string;
  estado: "activo" | "inactivo";
}

export interface StockAlert {
  productId: number;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  categoria: string;
  nivel: "bajo" | "critico";
}

export interface InventoryReport {
  totalProductos: number;
  valorTotal: number;
  productosBajos: number;
  productosCriticos: number;
  movimientosRecientes: InventoryMovement[];
  alertasStock: StockAlert[];
}

export interface InventoryStats {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  valorInventario: number;
  valorCompra: number;
  productosStockBajo: number;
  productosStockCritico: number;
  categorias: number;
  movimientosHoy: number;
  margenPromedio: number;
}

export interface InventoryFilter {
  categoria?: string;
  estado?: "activo" | "inactivo" | "all";
  stockBajo?: boolean;
  busqueda?: string;
}
