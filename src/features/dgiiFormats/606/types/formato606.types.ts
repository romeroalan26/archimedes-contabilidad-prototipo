export interface Compra {
  id: string;
  rncProveedor: string;
  tipoIdentificacion: "RNC" | "CEDULA";
  ncf: string;
  fechaComprobante: string;
  montoFacturado: number;
  itbisFacturado: number;
  retencionISR: number;
  retencionITBIS: number;
  tipoBienServicio: string;
  fechaPago: string;
}

export interface Formato606Config {
  mes: number;
  año: number;
  formatoExportacion: "xlsx" | "txt";
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  errors?: ValidationError[];
}
