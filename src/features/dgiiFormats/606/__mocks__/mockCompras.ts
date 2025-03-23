import { Compra } from "../types/formato606.types";

export const mockCompras: Compra[] = [
  {
    id: "1",
    rncProveedor: "101123456",
    tipoIdentificacion: "RNC",
    ncf: "B0100000001",
    fechaComprobante: "2024-03-15",
    montoFacturado: 15000.0,
    itbisFacturado: 2700.0,
    retencionISR: 1500.0,
    retencionITBIS: 0,
    tipoBienServicio: "01", // Servicios profesionales
    fechaPago: "2024-03-20",
  },
  {
    id: "2",
    rncProveedor: "223456789",
    tipoIdentificacion: "CEDULA",
    ncf: "B0100000002",
    fechaComprobante: "2024-03-18",
    montoFacturado: 25000.0,
    itbisFacturado: 4500.0,
    retencionISR: 0,
    retencionITBIS: 450.0,
    tipoBienServicio: "02", // Bienes tangibles
    fechaPago: "2024-03-22",
  },
  {
    id: "3",
    rncProveedor: "334567890",
    tipoIdentificacion: "RNC",
    ncf: "B0100000003",
    fechaComprobante: "2024-03-20",
    montoFacturado: 8000.0,
    itbisFacturado: 1440.0,
    retencionISR: 800.0,
    retencionITBIS: 0,
    tipoBienServicio: "03", // Servicios de mantenimiento
    fechaPago: "2024-03-25",
  },
];
