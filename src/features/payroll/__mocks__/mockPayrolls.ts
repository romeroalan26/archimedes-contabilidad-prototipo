import type { PayrollDetails } from "../types/payroll";

export const mockPayrolls: PayrollDetails[] = [
  {
    id: 1,
    empleadoId: 1,
    periodo: {
      inicio: "2024-01-01",
      fin: "2024-01-31",
      fechaPago: "2024-02-05",
    },
    salarioBase: 50000,
    bonificaciones: [
      {
        tipo: "horasExtra",
        monto: 5000,
        descripcion: "Bono de Productividad",
      },
    ],
    deducciones: [
      {
        tipo: "adelanto",
        monto: 2000,
        descripcion: "Avance de salario",
      },
    ],
    afp: 2500,
    ars: 1500,
    isr: 3000,
    salarioNeto: 42800,
    estado: "APROBADO",
    fechaCreacion: "2024-01-31T10:00:00",
    fechaActualizacion: "2024-02-05T15:30:00",
    tssEmpleado: {
      afp: 2500,
      sfs: 1500,
    },
    tssEmpleador: {
      afp: 2500,
      sfs: 1500,
      infotep: 500,
      riesgoLaboral: 250,
    },
  },
  {
    id: 2,
    empleadoId: 2,
    periodo: {
      inicio: "2024-01-01",
      fin: "2024-01-31",
      fechaPago: "2024-02-05",
    },
    salarioBase: 35000,
    bonificaciones: [],
    deducciones: [
      {
        tipo: "prestamo",
        monto: 1500,
        descripcion: "Préstamo personal",
      },
      {
        tipo: "otro",
        monto: 800,
        descripcion: "Seguro médico",
      },
    ],
    afp: 1750,
    ars: 1050,
    isr: 2100,
    salarioNeto: 28800,
    estado: "APROBADO",
    fechaCreacion: "2024-01-31T10:00:00",
    fechaActualizacion: "2024-02-05T15:30:00",
    tssEmpleado: {
      afp: 1750,
      sfs: 1050,
    },
    tssEmpleador: {
      afp: 1750,
      sfs: 1050,
      infotep: 350,
      riesgoLaboral: 175,
    },
  },
  {
    id: 3,
    empleadoId: 3,
    periodo: {
      inicio: "2024-01-01",
      fin: "2024-01-31",
      fechaPago: "2024-02-05",
    },
    salarioBase: 25000,
    bonificaciones: [],
    deducciones: [],
    afp: 1250,
    ars: 750,
    isr: 1500,
    salarioNeto: 21500,
    estado: "APROBADO",
    fechaCreacion: "2024-01-31T10:00:00",
    fechaActualizacion: "2024-02-05T15:30:00",
    tssEmpleado: {
      afp: 1250,
      sfs: 750,
    },
    tssEmpleador: {
      afp: 1250,
      sfs: 750,
      infotep: 250,
      riesgoLaboral: 125,
    },
  },
  {
    id: 4,
    empleadoId: 4,
    periodo: {
      inicio: "2024-01-01",
      fin: "2024-01-31",
      fechaPago: "2024-02-05",
    },
    salarioBase: 30000,
    bonificaciones: [
      {
        tipo: "otro",
        monto: 2000,
        descripcion: "Bono de Asistencia",
      },
    ],
    deducciones: [],
    afp: 1500,
    ars: 900,
    isr: 1800,
    salarioNeto: 25700,
    estado: "PENDIENTE",
    fechaCreacion: "2024-01-31T10:00:00",
    fechaActualizacion: "2024-01-31T10:00:00",
    tssEmpleado: {
      afp: 1500,
      sfs: 900,
    },
    tssEmpleador: {
      afp: 1500,
      sfs: 900,
      infotep: 300,
      riesgoLaboral: 150,
    },
  },
  // Nóminas de diciembre 2023 para probar el historial
  {
    id: 5,
    empleadoId: 1,
    periodo: {
      inicio: "2023-12-01",
      fin: "2023-12-31",
      fechaPago: "2024-01-05",
    },
    salarioBase: 50000,
    bonificaciones: [
      {
        tipo: "otro",
        monto: 10000,
        descripcion: "Bono de Navidad",
      },
    ],
    deducciones: [],
    afp: 2500,
    ars: 1500,
    isr: 3000,
    salarioNeto: 54800,
    estado: "APROBADO",
    fechaCreacion: "2023-12-31T10:00:00",
    fechaActualizacion: "2024-01-05T15:30:00",
    tssEmpleado: {
      afp: 2500,
      sfs: 1500,
    },
    tssEmpleador: {
      afp: 2500,
      sfs: 1500,
      infotep: 500,
      riesgoLaboral: 250,
    },
  },
  {
    id: 6,
    empleadoId: 2,
    periodo: {
      inicio: "2023-12-01",
      fin: "2023-12-31",
      fechaPago: "2024-01-05",
    },
    salarioBase: 35000,
    bonificaciones: [
      {
        tipo: "otro",
        monto: 7000,
        descripcion: "Bono de Navidad",
      },
    ],
    deducciones: [],
    afp: 1750,
    ars: 1050,
    isr: 2100,
    salarioNeto: 38100,
    estado: "APROBADO",
    fechaCreacion: "2023-12-31T10:00:00",
    fechaActualizacion: "2024-01-05T15:30:00",
    tssEmpleado: {
      afp: 1750,
      sfs: 1050,
    },
    tssEmpleador: {
      afp: 1750,
      sfs: 1050,
      infotep: 350,
      riesgoLaboral: 175,
    },
  },
];
