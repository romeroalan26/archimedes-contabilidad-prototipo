import { PurchaseStatus } from "../types";

export const formatPurchaseStatus = (status: PurchaseStatus): string => {
  const statusMap: Record<PurchaseStatus, string> = {
    PENDING: "Pendiente",
    PAID: "Pagada",
    OVERDUE: "Vencida",
  };
  return statusMap[status];
};
