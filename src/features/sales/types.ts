export interface Client {
  id: string;
  name: string;
  rnc: string;
  phone?: string;
  email?: string;
  billingType: "contado" | "credito" | "mixto";
  ncfType: "final" | "fiscal" | "gubernamental" | "especial";
}

export type BillingType = "contado" | "credito" | "mixto";
export type NCFType = "final" | "fiscal" | "gubernamental" | "especial";

export interface SaleItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  itbis: number; // ITBIS por item
}

export type SaleType = "credit" | "cash" | "mixed";

export interface Sale {
  id: number;
  clientId: number;
  date: Date;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: SaleItem[];
  type: SaleType;
  itbis: number; // ITBIS total
  cashAmount?: number; // Monto en efectivo (para ventas mixtas)
  creditAmount?: number; // Monto a crédito (para ventas mixtas)
}

export interface AccountStatement {
  id: number;
  clientId: number;
  date: Date;
  type: "sale" | "payment";
  amount: number;
  balance: number;
  description: string;
}
