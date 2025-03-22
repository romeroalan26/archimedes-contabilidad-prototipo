export type NcfType =
  | "B01" // Crédito Fiscal
  | "B02" // Consumo
  | "B03" // Gasto Menor
  | "B04" // Gubernamental
  | "B14" // Regímenes Especiales
  | "B15" // Gubernamental
  | "B16" // Zona Franca
  | "B17" // Exportaciones
  | "B18" // Comprobantes de Pago
  | "B19" // Comprobantes de Pago
  | "B20" // Comprobantes de Pago
  | "B21" // Comprobantes de Pago
  | "B22" // Comprobantes de Pago
  | "B23" // Comprobantes de Pago
  | "B24" // Comprobantes de Pago
  | "B25" // Comprobantes de Pago
  | "B26" // Comprobantes de Pago
  | "B27" // Comprobantes de Pago
  | "B28" // Comprobantes de Pago
  | "B29" // Comprobantes de Pago
  | "B30" // Comprobantes de Pago
  | "B31" // Comprobantes de Pago
  | "B32" // Comprobantes de Pago
  | "B33" // Comprobantes de Pago
  | "B34" // Comprobantes de Pago
  | "B35" // Comprobantes de Pago
  | "B36" // Comprobantes de Pago
  | "B37" // Comprobantes de Pago
  | "B38" // Comprobantes de Pago
  | "B39" // Comprobantes de Pago
  | "B40" // Comprobantes de Pago
  | "B41" // Comprobantes de Pago
  | "B42" // Comprobantes de Pago
  | "B43" // Comprobantes de Pago
  | "B44" // Comprobantes de Pago
  | "B45" // Comprobantes de Pago
  | "B46" // Comprobantes de Pago
  | "B47" // Comprobantes de Pago
  | "B48" // Comprobantes de Pago
  | "B49" // Comprobantes de Pago
  | "B50" // Comprobantes de Pago
  | "E31" // e-CF
  | "E32" // e-CF
  | "E33" // e-CF
  | "E34" // e-CF
  | "E35" // e-CF
  | "E36" // e-CF
  | "E37" // e-CF
  | "E38" // e-CF
  | "E39" // e-CF
  | "E40" // e-CF
  | "E41" // e-CF
  | "E42" // e-CF
  | "E43" // e-CF
  | "E44" // e-CF
  | "E45" // e-CF
  | "E46" // e-CF
  | "E47" // e-CF
  | "E48" // e-CF
  | "E49" // e-CF
  | "E50"; // e-CF

export type NcfStatus =
  | "Emitido"
  | "Anulado"
  | "Enviado"
  | "Rechazado"
  | "Aceptado";

export interface Ncf {
  id: number;
  tipo: NcfType;
  numero: string;
  cliente: string;
  fecha: string;
  estado: NcfStatus;
  createdAt: string;
  updatedAt: string;
  monto: number;
  itbis: number;
  total: number;
  observaciones?: string;
}

export interface NcfFormData {
  tipo: NcfType;
  numero: string;
  cliente: string;
  fecha: string;
  monto: number;
  itbis: number;
  total: number;
  observaciones?: string;
}

export interface NcfFilters {
  tipo?: NcfType;
  estado?: NcfStatus;
  fechaInicio?: string;
  fechaFin?: string;
  cliente?: string;
}
