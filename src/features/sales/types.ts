import { Client } from "../../types/types";

export type { Client };

export type PaymentMethod =
  | "efectivo"
  | "transferencia"
  | "tarjeta"
  | "cheque"
  | "otro";

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
}

export interface SaleItem {
  id: string;
  productId: number;
  quantity: number;
  price: number;
  itbis: number; // ITBIS por item
  discount?: number; // Descuento por item
  discountedSubtotal?: number; // Subtotal con descuento aplicado
}

export type SaleType = "credit" | "cash" | "mixed";

export interface Sale {
  id: string;
  clientId: string; // Updated to match Client interface
  date: Date;
  total: number;
  status: "pending" | "completed" | "cancelled" | "partial";
  items: SaleItem[];
  type: SaleType;
  itbis: number; // ITBIS total
  cashAmount?: number; // Monto en efectivo (para ventas mixtas)
  creditAmount?: number; // Monto a crédito (para ventas mixtas)
  advancePayment?: number; // Monto pagado como avance
  remainingBalance?: number; // Monto pendiente por pagar
  payments: Payment[]; // Lista de pagos realizados
  totalPaid: number; // Suma total de pagos realizados
}

export interface AccountStatement {
  id: string;
  clientId: string; // Updated to match Client interface
  date: Date;
  type: "sale" | "payment";
  amount: number;
  balance: number;
  description: string;
}

// Credit Note Types - Following accounting best practices
export type CreditNoteType =
  | "anulacion_total" // Total invoice cancellation
  | "anulacion_parcial" // Partial invoice cancellation
  | "devolucion" // Product return
  | "descuento_posterior" // Post-sale discount
  | "correccion_error"; // Error correction

export type CreditNoteStatus = "pendiente" | "aplicada" | "cancelada";

export interface CreditNoteItem {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  itbis: number;
  total: number;
  reason?: string; // Reason for this specific item
}

export interface CreditNote {
  id: string;
  numero: string; // Credit note number (sequential)
  fechaEmision: Date;
  clientId: string;
  clientName: string; // For display
  facturaOriginalId?: string; // Original invoice ID if applicable
  facturaOriginalNumero?: string; // Original invoice number for display
  tipo: CreditNoteType;
  motivo: string; // Main reason for the credit note
  items: CreditNoteItem[];
  subtotal: number;
  descuentoTotal: number;
  itbisTotal: number;
  montoTotal: number;
  status: CreditNoteStatus;
  observaciones?: string;
  fechaAplicacion?: Date; // When the credit was applied
  creadoPor: string; // User who created it
  fechaCreacion: Date;
  fechaModificacion?: Date;
}

// Form data for creating/editing credit notes
export interface CreditNoteFormData {
  clientId: string;
  facturaOriginalId?: string;
  tipo: CreditNoteType;
  motivo: string;
  items: Omit<CreditNoteItem, "id">[];
  observaciones?: string;
}

// API response types for credit notes
export interface ApiCreditNote {
  nota_credito_id: string;
  numero: string;
  fecha_emision: string;
  cliente_id: string;
  cliente_nombre: string;
  factura_original_id?: string;
  factura_original_numero?: string;
  tipo: CreditNoteType;
  motivo: string;
  items: {
    producto_id: number;
    producto_nombre: string;
    cantidad: number;
    precio_unitario: string;
    subtotal: string;
    itbis: string;
    total: string;
    razon?: string;
  }[];
  subtotal: string;
  descuento_total: string;
  itbis_total: string;
  monto_total: string;
  estado: CreditNoteStatus;
  observaciones?: string;
  fecha_aplicacion?: string;
  creado_por: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiCreditNotesResponse {
  mensaje: string;
  notas_credito: ApiCreditNote[];
  total: number;
}

export interface ApiCreditNoteResponse {
  mensaje: string;
  nota_credito: ApiCreditNote;
}

// Credit note statistics
export interface CreditNoteStats {
  totalNotasCredito: number;
  montoTotalCreditos: number;
  notasPendientes: number;
  notasAplicadas: number;
  montoPendiente: number;
  montoAplicado: number;
}

// Credit note filters
export interface CreditNoteFilters {
  search: string;
  clientId?: string;
  tipo?: CreditNoteType;
  status?: CreditNoteStatus;
  fechaDesde?: Date;
  fechaHasta?: Date;
  facturaOriginalId?: string;
}

// Constants for credit note types and status
export const CREDIT_NOTE_TYPE_LABELS: Record<CreditNoteType, string> = {
  anulacion_total: "Anulación Total",
  anulacion_parcial: "Anulación Parcial",
  devolucion: "Devolución",
  descuento_posterior: "Descuento Posterior",
  correccion_error: "Corrección de Error",
};

export const CREDIT_NOTE_STATUS_LABELS: Record<CreditNoteStatus, string> = {
  pendiente: "Pendiente",
  aplicada: "Aplicada",
  cancelada: "Cancelada",
};

export const CREDIT_NOTE_STATUS_COLORS: Record<CreditNoteStatus, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  aplicada: "bg-green-100 text-green-800",
  cancelada: "bg-red-100 text-red-800",
};
