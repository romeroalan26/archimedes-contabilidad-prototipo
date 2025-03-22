export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
}

export interface SaleItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Sale {
  id: number;
  clientId: number;
  date: Date;
  total: number;
  status: "pending" | "completed" | "cancelled";
  items: SaleItem[];
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
