export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
}

export const empleadosSimulados: Employee[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "00112345678",
    posicion: "Maestro Constructor",
    salario: 35000,
    fechaIngreso: "2023-01-15",
    estado: "activo"
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    cedula: "00198765432",
    posicion: "Contadora",
    salario: 55000,
    fechaIngreso: "2023-03-01",
    estado: "activo"
  },
];
