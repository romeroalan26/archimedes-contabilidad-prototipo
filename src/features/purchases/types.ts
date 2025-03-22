export interface Supplier {
  id: number;
  nombre: string;
  rnc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface Product {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  unidad: string;
}

export interface Account {
  id: number;
  codigo: string;
  nombre: string;
  tipo: "activo" | "pasivo" | "capital" | "ingreso" | "egreso";
  saldo: number;
}

export type PayableType = "SUPPLIER" | "CREDIT_CARD" | "CASH";

export interface PurchaseItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Purchase {
  id: number;
  supplierId: number;
  fecha: string;
  monto: number;
  itbis: number;
  retencionIsr: number;
  fechaVencimiento: string;
  tipoCuentaPagar: PayableType;
  cuentaGastoId: number;
  cuentaPagarId: number;
  estado: "PENDING" | "PAID" | "OVERDUE";
  items: PurchaseItem[];
}

export interface CreatePurchaseDTO {
  supplierId: string;
  fecha: string;
  monto: string;
  itbis: string;
  retencionIsr: string;
  fechaVencimiento: string;
  tipoCuentaPagar: PayableType;
  cuentaGastoId: string;
  cuentaPagarId: string;
  items: {
    productId: string;
    quantity: string;
    price: string;
  }[];
}

export interface UpdatePurchaseDTO {
  fecha?: string;
  monto?: string;
  itbis?: string;
  retencionIsr?: string;
  fechaVencimiento?: string;
  estado?: "PENDING" | "PAID" | "OVERDUE";
  tipoCuentaPagar?: PayableType;
  cuentaGastoId?: string;
  cuentaPagarId?: string;
  items?: {
    productId: string;
    quantity: string;
    price: string;
  }[];
}

export interface PayableTransaction {
  id: number;
  supplierId: number;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: "factura" | "pago";
}

export interface PayableStatus {
  supplierId: number;
  transactions: PayableTransaction[];
  totalPendiente: number;
}

export type PurchaseStatus = "PENDING" | "PAID" | "OVERDUE";
