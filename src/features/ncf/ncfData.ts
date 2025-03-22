export interface Ncf {
  id: number;
  tipo: string;
  numero: string;
  cliente: string;
  fecha: string;
  estado: "Emitido" | "Anulado";
}

export const ncfSimulados: Ncf[] = [
  {
    id: 1,
    tipo: "Factura de Crédito Fiscal",
    numero: "B0100000001",
    cliente: "Constructora XYZ",
    fecha: "2025-03-01",
    estado: "Emitido",
  },
  {
    id: 2,
    tipo: "Factura de Consumo",
    numero: "B0200000002",
    cliente: "Inversiones ABC",
    fecha: "2025-03-02",
    estado: "Emitido",
  },
];
