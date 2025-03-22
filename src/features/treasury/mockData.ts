import type {
  BankAccount,
  BankOperation,
  CashFlowEntry,
  BankReconciliation,
} from "./types";

export const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    banco: "Banco de Crédito",
    numeroCuenta: "193-12345678-0-00",
    tipo: "corriente",
    saldo: 50000.0,
    saldoConciliado: 50000.0,
    moneda: "DOP",
  },
  {
    id: 2,
    banco: "BBVA República Dominicana",
    numeroCuenta: "0011-0134-0101234567",
    tipo: "ahorro",
    saldo: 25000.0,
    saldoConciliado: 25000.0,
    moneda: "USD",
  },
  {
    id: 3,
    banco: "Banco Popular",
    numeroCuenta: "898-3100000000-0-00",
    tipo: "inversion",
    saldo: 100000.0,
    saldoConciliado: 100000.0,
    moneda: "DOP",
  },
];

export const mockBankOperations: BankOperation[] = [
  {
    id: 1,
    tipo: "ingreso",
    bancoId: 1,
    fecha: "2024-03-15T10:00:00Z",
    monto: 5000.0,
    beneficiario: "Cliente ABC",
    concepto: "Pago de factura",
    numeroReferencia: "REF-001",
    estado: "completado",
  },
  {
    id: 2,
    tipo: "egreso",
    bancoId: 2,
    fecha: "2024-03-15T14:30:00Z",
    monto: 2500.0,
    beneficiario: "Proveedor XYZ",
    concepto: "Pago de servicios",
    numeroReferencia: "REF-002",
    estado: "pendiente",
  },
  {
    id: 3,
    tipo: "transferencia",
    bancoId: 1,
    fecha: "2024-03-16T09:15:00Z",
    monto: 3000.0,
    beneficiario: "Cuenta propia",
    concepto: "Transferencia entre cuentas",
    numeroReferencia: "REF-003",
    estado: "completado",
  },
];

export const mockCashFlow: CashFlowEntry[] = [
  {
    id: 1,
    fecha: "2024-03-15T10:00:00Z",
    tipo: "ingreso",
    monto: 5000.0,
    concepto: "Pago de factura",
    categoria: "Ventas",
    bancoId: 1,
  },
  {
    id: 2,
    fecha: "2024-03-15T14:30:00Z",
    tipo: "egreso",
    monto: 2500.0,
    concepto: "Pago de servicios",
    categoria: "Servicios",
    bancoId: 2,
  },
  {
    id: 3,
    fecha: "2024-03-16T09:15:00Z",
    tipo: "egreso",
    monto: 3000.0,
    concepto: "Transferencia entre cuentas",
    categoria: "Transferencias",
    bancoId: 1,
  },
];

export const mockReconciliations: BankReconciliation[] = [
  {
    id: 1,
    bancoId: 1,
    fechaInicio: "2024-03-01T00:00:00Z",
    fechaFin: "2024-03-15T23:59:59Z",
    saldoInicial: 45000.0,
    saldoFinal: 50000.0,
    operacionesConciliadas: [1],
    estado: "conciliado",
  },
  {
    id: 2,
    bancoId: 2,
    fechaInicio: "2024-03-01T00:00:00Z",
    fechaFin: "2024-03-15T23:59:59Z",
    saldoInicial: 27500.0,
    saldoFinal: 25000.0,
    operacionesConciliadas: [],
    estado: "pendiente",
  },
];
