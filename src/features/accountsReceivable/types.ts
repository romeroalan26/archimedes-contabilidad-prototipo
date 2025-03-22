export interface Customer {
  id: number;
  nombre: string;
  rnc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface Account {
  id: number;
  codigo: string;
  nombre: string;
  tipo: "activo" | "pasivo" | "capital" | "ingreso" | "egreso";
}

export type PaymentMethod = "CASH" | "TRANSFER" | "CHECK" | "CREDIT_CARD";

export type ReceivableStatus = "PENDING" | "PAID" | "OVERDUE";

export interface ReceivableTransaction {
  id: number;
  customerId: number;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: "factura" | "pago";
}

export interface CustomerReceivableStatus {
  customerId: number;
  transactions: ReceivableTransaction[];
  totalPendiente: number;
}

export interface Receivable {
  id: number;
  customerId: number;
  fecha: string;
  monto: number;
  concepto: string;
  metodoPago: PaymentMethod;
  reciboId?: string;
  estado: ReceivableStatus;
}

export interface CreateReceivableDTO {
  customerId: string;
  monto: string;
  fecha: string;
  concepto: string;
  metodoPago: PaymentMethod;
  reciboId?: string;
}

export interface UpdateReceivableDTO {
  monto?: string;
  fecha?: string;
  concepto?: string;
  metodoPago?: PaymentMethod;
  reciboId?: string;
  estado?: ReceivableStatus;
}
