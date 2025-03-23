export interface Bank {
  id: string;
  name: string;
  code: string;
}

export interface ReconciliationMovement {
  id: string;
  date: string;
  type: "DEPOSIT" | "CHECK" | "TRANSFER";
  description: string;
  amount: number;
  isReconciled: boolean;
  reference?: string;
}

export interface Reconciliation {
  id: string;
  bankId: string;
  month: number;
  year: number;
  bankBalance: number;
  movements: ReconciliationMovement[];
  reconciledBalance: number;
  difference: number;
  status: "PENDING" | "RECONCILED" | "DISCREPANCY";
  createdAt: string;
  updatedAt: string;
}

export interface CreateReconciliationDTO {
  bankId: string;
  month: number;
  year: number;
  bankBalance: number;
}

export interface UpdateReconciliationDTO {
  bankBalance?: number;
  movements?: ReconciliationMovement[];
  balanceConciliado?: number;
  diferencia?: number;
  movimientosAclarados?: string[];
  status?: Reconciliation["status"];
}

export interface ReconciliationFilters {
  bankId?: string;
  month?: number;
  year?: number;
  status?: Reconciliation["status"];
}
