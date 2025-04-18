import { Client, Sale, AccountStatement } from "./types";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Juan Pérez",
    rnc: "101234567",
    phone: "809-123-4567",
    email: "juan@example.com",
    billingType: "credito",
    ncfType: "fiscal",
  },
  {
    id: "2",
    name: "María García",
    rnc: "102345678",
    phone: "809-987-6543",
    email: "maria@example.com",
    billingType: "contado",
    ncfType: "final",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    rnc: "103456789",
    phone: "809-456-7890",
    email: "carlos@example.com",
    billingType: "mixto",
    ncfType: "fiscal",
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
        productId: "1",
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
        productId: "2",
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
