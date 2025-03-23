export interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
  tipoContrato: '01' | '02' | '03'; // 01 = Indefinido, 02 = Temporal, 03 = Por Obra
}

export interface EmployeeFormData {
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
} 