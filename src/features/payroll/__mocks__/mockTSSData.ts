import type { Employee } from '../types/employee';
import type { PayrollDetails } from '../types/payroll';

export const mockEmployees: Employee[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    cedula: '123-456-7890',
    fechaIngreso: '2023-01-15',
    posicion: 'Desarrollador Senior',
    salario: 75000,
    estado: 'activo',
    tipoContrato: '01'
  },
  {
    id: 2,
    nombre: 'María García',
    cedula: '987-654-3210',
    fechaIngreso: '2023-03-01',
    posicion: 'Contadora',
    salario: 65000,
    estado: 'activo',
    tipoContrato: '01'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    cedula: '456-789-1230',
    fechaIngreso: '2023-06-10',
    posicion: 'Analista de RRHH',
    salario: 55000,
    estado: 'activo',
    tipoContrato: '02'
  }
];

export const mockPayrolls: PayrollDetails[] = [
  {
    id: 1,
    empleadoId: 1,
    periodo: {
      inicio: '2024-03-01',
      fin: '2024-03-31',
      fechaPago: '2024-04-05'
    },
    salarioBase: 75000,
    bonificaciones: [
      {
        tipo: 'horasExtra',
        descripcion: 'Horas Extra',
        monto: 5000
      }
    ],
    deducciones: [
      {
        tipo: 'prestamo',
        descripcion: 'Préstamo',
        monto: 2000
      }
    ],
    afp: 3750,
    ars: 2250,
    isr: 7500,
    salarioNeto: 64500,
    estado: 'aprobado',
    fechaCreacion: '2024-03-01T00:00:00Z',
    fechaActualizacion: '2024-03-01T00:00:00Z',
    tssEmpleado: {
      afp: 3750,
      sfs: 2250
    },
    tssEmpleador: {
      afp: 7500,
      sfs: 4500,
      infotep: 750,
      riesgoLaboral: 900
    }
  },
  {
    id: 2,
    empleadoId: 2,
    periodo: {
      inicio: '2024-03-01',
      fin: '2024-03-31',
      fechaPago: '2024-04-05'
    },
    salarioBase: 65000,
    bonificaciones: [],
    deducciones: [],
    afp: 3250,
    ars: 1950,
    isr: 6500,
    salarioNeto: 55250,
    estado: 'aprobado',
    fechaCreacion: '2024-03-01T00:00:00Z',
    fechaActualizacion: '2024-03-01T00:00:00Z',
    tssEmpleado: {
      afp: 3250,
      sfs: 1950
    },
    tssEmpleador: {
      afp: 6500,
      sfs: 3900,
      infotep: 650,
      riesgoLaboral: 780
    }
  },
  {
    id: 3,
    empleadoId: 3,
    periodo: {
      inicio: '2024-03-01',
      fin: '2024-03-31',
      fechaPago: '2024-04-05'
    },
    salarioBase: 55000,
    bonificaciones: [
      {
        tipo: 'otro',
        descripcion: 'Bono de Productividad',
        monto: 3000
      }
    ],
    deducciones: [],
    afp: 2750,
    ars: 1650,
    isr: 5500,
    salarioNeto: 45700,
    estado: 'aprobado',
    fechaCreacion: '2024-03-01T00:00:00Z',
    fechaActualizacion: '2024-03-01T00:00:00Z',
    tssEmpleado: {
      afp: 2750,
      sfs: 1650
    },
    tssEmpleador: {
      afp: 5500,
      sfs: 3300,
      infotep: 550,
      riesgoLaboral: 660
    }
  }
]; 