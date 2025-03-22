export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
}

export const empleadosSimulados: Employee[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "00112345678",
    posicion: "Maestro Constructor",
    salario: 35000,
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    cedula: "00198765432",
    posicion: "Contadora",
    salario: 55000,
  },
];
