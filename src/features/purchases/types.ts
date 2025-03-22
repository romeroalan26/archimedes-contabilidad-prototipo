export interface Supplier {
  id: number;
  nombre: string;
  rnc: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Purchase {
  id: number;
  supplierId: number;
  fecha: string;
  monto: number;
  itbis: number;
  retencionIsr: number;
  fechaVencimiento: string;
  estado: "pendiente" | "pagada" | "vencida";
}

export interface PayableTransaction {
  id: number;
  supplierId: number;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: "factura" | "pago";
}

export interface PayableStatus {
  supplierId: number;
  transactions: PayableTransaction[];
  totalPendiente: number;
}
