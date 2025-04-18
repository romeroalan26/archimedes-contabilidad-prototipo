export type NcfType =
  | "B01" // Consumidor Final
  | "B02" // Crédito Fiscal
  | "B14" // Gubernamental
  | "B15"; // Régimen Especial

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
