import { Supplier, Purchase, PayableTransaction, PayableStatus } from "./types";

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    nombre: "Distribuidora XYZ",
    rnc: "101-89745-2",
    direccion: "Calle Principal #45, Santo Domingo",
    telefono: "809-555-0101",
    email: "ventas@xyz.com",
  },
  {
    id: 2,
    nombre: "Importadora ABC",
    rnc: "401-12345-1",
    direccion: "Av. 27 de Febrero #123, Santiago",
    telefono: "809-555-0202",
    email: "contacto@abc.com",
  },
  {
    id: 3,
    nombre: "Suplidores Unidos",
    rnc: "501-98765-3",
    direccion: "Calle Duarte #78, La Romana",
    telefono: "809-555-0303",
    email: "info@suplidores.com",
  },
];

export const mockPurchases: Purchase[] = [
  {
    id: 1,
    supplierId: 1,
    fecha: "2024-03-15",
    monto: 1500.0,
    itbis: 225.0,
    retencionIsr: 75.0,
    fechaVencimiento: "2024-04-15",
    tipoCuentaPagar: "SUPPLIER",
    cuentaGastoId: 1,
    cuentaPagarId: 1,
    estado: "PENDING",
    items: [
      {
        productId: 1,
        quantity: 10,
        price: 150.0,
        subtotal: 1500.0,
      },
    ],
  },
  {
    id: 2,
    supplierId: 2,
    fecha: "2024-03-10",
    monto: 2500.0,
    itbis: 375.0,
    retencionIsr: 125.0,
    fechaVencimiento: "2024-04-10",
    tipoCuentaPagar: "CREDIT_CARD",
    cuentaGastoId: 2,
    cuentaPagarId: 2,
    estado: "PAID",
    items: [
      {
        productId: 2,
        quantity: 5,
        price: 500.0,
        subtotal: 2500.0,
      },
    ],
  },
  {
    id: 3,
    supplierId: 3,
    fecha: "2024-02-15",
    monto: 3500.0,
    itbis: 525.0,
    retencionIsr: 175.0,
    fechaVencimiento: "2024-03-15",
    tipoCuentaPagar: "CASH",
    cuentaGastoId: 3,
    cuentaPagarId: 3,
    estado: "OVERDUE",
    items: [
      {
        productId: 3,
        quantity: 7,
        price: 500.0,
        subtotal: 3500.0,
      },
    ],
  },
];

export const mockPayableTransactions: PayableTransaction[] = [
  {
    id: 1,
    supplierId: 1,
    fecha: "2024-03-15",
    descripcion: "Factura #A101",
    monto: 29000,
    tipo: "factura",
  },
  {
    id: 2,
    supplierId: 1,
    fecha: "2024-03-20",
    descripcion: "Pago parcial",
    monto: -10000,
    tipo: "pago",
  },
  {
    id: 3,
    supplierId: 1,
    fecha: "2024-03-25",
    descripcion: "Factura #A102",
    monto: 35400,
    tipo: "factura",
  },
];

export const mockPayableStatus: PayableStatus[] = [
  {
    supplierId: 1,
    transactions: mockPayableTransactions.filter((t) => t.supplierId === 1),
    totalPendiente: 54400,
  },
];
