export type TipoIdentificacion = "1" | "2" | "3" | "4"; // RNC, Cédula, Pasaporte, Consumo
export type TipoComprobante = "B01" | "B02" | "B14" | "B15";
export type FormaPago = "01" | "02" | "03" | "04"; // Efectivo, Cheque, Tarjeta, Transferencia

export interface Venta {
  id: string;
  rncCedula: string;
  tipoIdentificacion: TipoIdentificacion;
  ncf: string;
  tipoComprobante: TipoComprobante;
  fechaComprobante: string;
  montoFacturado: number;
  itbisFacturado: number;
  retenciones: {
    isr: number;
    itbis: number;
  };
  formaPago: FormaPago;
}

export interface Periodo {
  mes: number;
  año: number;
}

export interface ExportOptions {
  formato: "xlsx" | "txt";
  separador: "," | "\t";
}

// TODO: Replace with actual API response type
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
