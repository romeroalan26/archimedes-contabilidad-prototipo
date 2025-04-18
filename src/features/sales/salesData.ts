import { Client, Sale, AccountStatement } from "./types";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "809-123-4567",
    rnc: "123-456789-0",
    billingType: "contado",
    ncfType: "consumidor_final",
  },
  {
    id: "2",
    name: "María García",
    email: "maria@example.com",
    phone: "809-987-6543",
    rnc: "987-654321-0",
    billingType: "credito",
    ncfType: "credito_fiscal",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    phone: "809-456-7890",
    rnc: "456-789012-0",
    billingType: "mixto",
    ncfType: "gubernamental",
  },
];

export const mockSales: Sale[] = [
  {
    id: "1",
    clientId: "1",
    date: new Date("2024-02-20"),
    total: 15000,
    status: "completed",
    type: "cash",
    itbis: 15000 * 0.18,
    items: [
      {
        id: "1",
        productId: 1,
        quantity: 2,
        price: 7500,
        itbis: 7500 * 0.18,
      },
    ],
  },
  {
    id: "2",
    clientId: "2",
    date: new Date("2024-02-19"),
    total: 25000,
    status: "pending",
    type: "credit",
    itbis: 25000 * 0.18,
    items: [
      {
        id: "2",
        productId: 2,
        quantity: 1,
        price: 25000,
        itbis: 25000 * 0.18,
      },
    ],
  },
];

export const mockAccountStatements: AccountStatement[] = [
  {
    id: "1",
    clientId: "1",
    date: new Date("2024-02-20"),
    type: "sale",
    amount: 15000,
    balance: 15000,
    description: "Venta #1",
  },
  {
    id: "2",
    clientId: "1",
    date: new Date("2024-02-21"),
    type: "payment",
    amount: -10000,
    balance: 5000,
    description: "Pago parcial",
  },
  {
    id: "3",
    clientId: "2",
    date: new Date("2024-02-19"),
    type: "sale",
    amount: 25000,
    balance: 25000,
    description: "Venta #2",
  },
];
