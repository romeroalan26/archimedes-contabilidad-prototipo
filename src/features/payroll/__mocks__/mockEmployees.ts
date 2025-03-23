import type { Employee } from "../types/employee";

export const mockEmployees: Employee[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "12345678901",
    posicion: "Desarrollador Senior",
    salario: 50000,
    fechaIngreso: "2023-01-15",
    estado: "ACTIVO",
    tipoContrato: "indefinido",
  },
  {
    id: 2,
    nombre: "María Rodríguez",
    cedula: "12345678902",
    posicion: "Diseñadora UX",
    salario: 35000,
    fechaIngreso: "2023-03-20",
    estado: "ACTIVO",
    tipoContrato: "indefinido",
  },
  {
    id: 3,
    nombre: "Carlos Martínez",
    cedula: "12345678903",
    posicion: "Analista de Datos",
    salario: 25000,
    fechaIngreso: "2023-06-10",
    estado: "INACTIVO",
    tipoContrato: "temporal",
  },
  {
    id: 4,
    nombre: "Ana García",
    cedula: "12345678904",
    posicion: "Gerente de Proyecto",
    salario: 30000,
    fechaIngreso: "2023-09-05",
    estado: "ACTIVO",
    tipoContrato: "indefinido",
  },
];
