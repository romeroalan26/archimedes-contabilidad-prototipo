import { ReceivableStatus } from "../types";

export const formatReceivableStatus = (status: ReceivableStatus): string => {
  const statusMap: Record<ReceivableStatus, string> = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    OVERDUE: "Vencido",
  };
  return statusMap[status];
};
