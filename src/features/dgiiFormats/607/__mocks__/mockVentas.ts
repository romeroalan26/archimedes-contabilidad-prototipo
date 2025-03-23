import { Venta } from "../types/formato607.types";

export const mockVentas: Venta[] = [
  {
    id: "1",
    rncCedula: "101123456",
    tipoIdentificacion: "1", // RNC
    ncf: "B0100000001",
    tipoComprobante: "B01",
    fechaComprobante: "2024-03-15",
    montoFacturado: 15000.0,
    itbisFacturado: 2280.0,
    retenciones: {
      isr: 0,
      itbis: 0,
    },
    formaPago: "03", // Tarjeta
  },
  {
    id: "2",
    rncCedula: "40212345678",
    tipoIdentificacion: "2", // Cédula
    ncf: "B1400000001",
    tipoComprobante: "B14",
    fechaComprobante: "2024-03-20",
    montoFacturado: 2500.0,
    itbisFacturado: 380.0,
    retenciones: {
      isr: 0,
      itbis: 0,
    },
    formaPago: "01", // Efectivo
  },
  {
    id: "3",
    rncCedula: "0000000000",
    tipoIdentificacion: "4", // Consumo
    ncf: "B0100000002",
    tipoComprobante: "B01",
    fechaComprobante: "2024-03-25",
    montoFacturado: 500.0,
    itbisFacturado: 76.0,
    retenciones: {
      isr: 0,
      itbis: 0,
    },
    formaPago: "02", // Cheque
  },
];
