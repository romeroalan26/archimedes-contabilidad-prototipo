export interface BankAccount {
  id: number;
  banco: string;
  numeroCuenta: string;
  tipo: "corriente" | "ahorro" | "inversion";
  saldo: number;
  saldoConciliado: number;
  moneda: "DOP" | "USD";
}

export interface BankOperation {
  id: number;
  tipo: "ingreso" | "egreso" | "transferencia";
  bancoId: number;
  fecha: string;
  monto: number;
  beneficiario: string;
  concepto: string;
  numeroReferencia: string;
  estado: "pendiente" | "completado" | "cancelado";
}

export interface CashFlowEntry {
  id: number;
  fecha: string;
  tipo: "ingreso" | "egreso";
  monto: number;
  concepto: string;
  categoria: string;
  bancoId: number;
}

export interface BankReconciliation {
  id: number;
  bancoId: number;
  fechaInicio: string;
  fechaFin: string;
  saldoInicial: number;
  saldoFinal: number;
  operacionesConciliadas: number[];
  estado: "pendiente" | "conciliado" | "discrepancia";
}
