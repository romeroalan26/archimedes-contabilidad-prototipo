export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: "ACTIVO" | "INACTIVO";
  tipoContrato: "indefinido" | "temporal";
}

export interface EmployeeFormData {
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: "activo" | "inactivo";
}
