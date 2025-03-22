import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBankAccounts,
  getBankAccountById,
  getBankOperations,
  createBankOperation,
  updateBankOperationStatus,
  getCashFlow,
  createCashFlowEntry,
  getReconciliations,
  createReconciliation,
  updateReconciliationStatus,
} from "./services";
import type { BankOperation, BankReconciliation } from "./types";

// Hooks para Cuentas Bancarias
export const useBankAccounts = () => {
  return useQuery({
    queryKey: ["bank-accounts"],
    queryFn: getBankAccounts,
  });
};

export const useBankAccount = (id: number) => {
  return useQuery({
    queryKey: ["bank-account", id],
    queryFn: () => getBankAccountById(id),
    enabled: !!id,
  });
};

// Hooks para Operaciones Bancarias
export const useBankOperations = () => {
  return useQuery({
    queryKey: ["bank-operations"],
    queryFn: getBankOperations,
  });
};

export const useCreateBankOperation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBankOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-operations"] });
    },
  });
};

export const useUpdateBankOperationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: number;
      estado: BankOperation["estado"];
    }) => updateBankOperationStatus(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-operations"] });
    },
  });
};

// Hooks para Flujo de Caja
export const useCashFlow = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["cash-flow", startDate, endDate],
    queryFn: () => getCashFlow(startDate, endDate),
  });
};

export const useCreateCashFlowEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCashFlowEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-flow"] });
    },
  });
};

// Hooks para Conciliación Bancaria
export const useReconciliations = () => {
  return useQuery({
    queryKey: ["reconciliations"],
    queryFn: getReconciliations,
  });
};

export const useCreateReconciliation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReconciliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliations"] });
    },
  });
};

export function useUpdateReconciliationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      estado,
    }: {
      id: number;
      estado: BankReconciliation["estado"];
    }) => updateReconciliationStatus(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliations"] });
    },
  });
}
