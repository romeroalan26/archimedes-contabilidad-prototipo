export interface Purchase {
  id: number;
  supplierId: number;
  fecha: string;
  monto: number;
  itbis: number;
  retencionIsr: number;
  retencionItbisPercentage: number;
  fechaVencimiento: string;
  estado: "PENDING" | "PAID" | "OVERDUE";
}
