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
