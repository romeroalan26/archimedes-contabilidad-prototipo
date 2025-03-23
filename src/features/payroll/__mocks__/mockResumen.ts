import type { PayrollSummary } from "../types/payroll";

export const mockResumen: PayrollSummary = {
  periodo: {
    inicio: "2024-01-01",
    fin: "2024-01-31",
    fechaPago: "2024-02-05",
  },
  totalEmpleados: 4,
  totalNomina: 140000,
  totalDeducciones: 4300,
  totalNeto: 118100,
  estado: "PROCESADO",
  distribucion: {
    porEmpleado: [
      {
        nombre: "Juan Pérez",
        salarioBase: 50000,
        bonificaciones: 5000,
        deducciones: 2000,
        neto: 42800,
      },
      {
        nombre: "María Rodríguez",
        salarioBase: 35000,
        bonificaciones: 0,
        deducciones: 2300,
        neto: 28800,
      },
      {
        nombre: "Carlos Martínez",
        salarioBase: 25000,
        bonificaciones: 0,
        deducciones: 0,
        neto: 21500,
      },
      {
        nombre: "Ana García",
        salarioBase: 30000,
        bonificaciones: 2000,
        deducciones: 0,
        neto: 25700,
      },
    ],
    porCategoria: [
      {
        categoria: "Salarios Base",
        monto: 140000,
        color: "#3B82F6", // blue-500
      },
      {
        categoria: "Bonificaciones",
        monto: 7000,
        color: "#10B981", // green-500
      },
      {
        categoria: "Deducciones",
        monto: 4300,
        color: "#EF4444", // red-500
      },
      {
        categoria: "Salarios Netos",
        monto: 118100,
        color: "#8B5CF6", // purple-500
      },
    ],
  },
};
