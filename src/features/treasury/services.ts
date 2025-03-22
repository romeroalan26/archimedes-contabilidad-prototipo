import type {
  BankAccount,
  BankOperation,
  CashFlowEntry,
  BankReconciliation,
} from "./types";
import {
  mockBankAccounts,
  mockBankOperations,
  mockCashFlow,
  mockReconciliations,
} from "./mockData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simular error aleatorio (20% de probabilidad)
const simulateError = () => {
  if (Math.random() < 0.2) {
    throw new Error("Error de conexión");
  }
};

// Servicios para Cuentas Bancarias
export const getBankAccounts = async (): Promise<BankAccount[]> => {
  await delay(500);
  simulateError();
  return mockBankAccounts;
};

export const getBankAccountById = async (
  id: number
): Promise<BankAccount | undefined> => {
  await delay(300);
  simulateError();
  return mockBankAccounts.find((account) => account.id === id);
};

// Servicios para Operaciones Bancarias
export const getBankOperations = async (): Promise<BankOperation[]> => {
  await delay(500);
  simulateError();
  return mockBankOperations;
};

export const createBankOperation = async (
  operation: Omit<BankOperation, "id">
): Promise<BankOperation> => {
  await delay(800);
  simulateError();
  const newOperation: BankOperation = {
    ...operation,
    id: Math.max(...mockBankOperations.map((op) => op.id)) + 1,
  };
  mockBankOperations.push(newOperation);
  return newOperation;
};

export const updateBankOperationStatus = async (
  id: number,
  estado: BankOperation["estado"]
): Promise<BankOperation> => {
  await delay(500);
  simulateError();
  const operation = mockBankOperations.find((op) => op.id === id);
  if (!operation) {
    throw new Error("Operación no encontrada");
  }
  operation.estado = estado;
  return operation;
};

// Servicios para Flujo de Caja
export const getCashFlow = async (
  startDate: string,
  endDate: string
): Promise<CashFlowEntry[]> => {
  await delay(500);
  simulateError();
  return mockCashFlow.filter(
    (entry) =>
      new Date(entry.fecha) >= new Date(startDate) &&
      new Date(entry.fecha) <= new Date(endDate)
  );
};

export const createCashFlowEntry = async (
  entry: Omit<CashFlowEntry, "id">
): Promise<CashFlowEntry> => {
  await delay(800);
  simulateError();
  const newEntry: CashFlowEntry = {
    ...entry,
    id: Math.max(...mockCashFlow.map((e) => e.id)) + 1,
  };
  mockCashFlow.push(newEntry);
  return newEntry;
};

// Servicios para Conciliación Bancaria
export const getReconciliations = async (): Promise<BankReconciliation[]> => {
  await delay(500);
  simulateError();
  return mockReconciliations;
};

export const createReconciliation = async (
  reconciliation: Omit<BankReconciliation, "id">
): Promise<BankReconciliation> => {
  await delay(800);
  simulateError();
  const newReconciliation: BankReconciliation = {
    ...reconciliation,
    id: Math.max(...mockReconciliations.map((r) => r.id)) + 1,
  };
  mockReconciliations.push(newReconciliation);
  return newReconciliation;
};

export const updateReconciliationStatus = async (
  id: number,
  estado: BankReconciliation["estado"],
  observaciones?: string
): Promise<BankReconciliation> => {
  await delay(500);
  simulateError();
  const reconciliation = mockReconciliations.find((r) => r.id === id);
  if (!reconciliation) {
    throw new Error("Conciliación no encontrada");
  }
  reconciliation.estado = estado;
  return reconciliation;
};
