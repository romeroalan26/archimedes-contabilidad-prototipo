import type { Employee } from "../types/employee";
import type { PayrollDetails } from "../types/payroll";
import { validateDeductions, PAYROLL_LIMITS } from "../utils/validations";
import { calculatePayrollDeductions, calcularSalarioNeto } from "../utils/calculations";

const API_URL = "/api/payroll";

export interface PayrollServices {
  // Employee services
  getEmployees: () => Promise<Employee[]>;
  getEmployee: (id: number) => Promise<Employee>;
  createEmployee: (employee: Omit<Employee, "id">) => Promise<Employee>;
  updateEmployee: (id: number, employee: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
  
  // Payroll services
  createPayroll: (payroll: Omit<PayrollDetails, "id">) => Promise<PayrollDetails>;
  getPayrollDetails: (id: number) => Promise<PayrollDetails>;
  getPayrollHistory: (filters?: { empleadoId?: number; periodoInicio?: string; periodoFin?: string }) => Promise<PayrollDetails[]>;
  exportPayroll: (id: number, format: "tss" | "pdf") => Promise<Blob>;
  calculatePayroll: (employeeId: number) => Promise<PayrollDetails>;
}

// Clase personalizada para errores de la API
export class PayrollAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "PayrollAPIError";
  }
}

export const payrollServices: PayrollServices = {
  // Employee services
  getEmployees: async () => {
    // TODO: Implementar con backend
    return [];
  },
  getEmployee: async (id: number) => {
    // TODO: Implementar con backend
    return {
      id,
      nombre: "",
      cedula: "",
      posicion: "",
      salario: 0,
      fechaIngreso: new Date().toISOString(),
      estado: "activo",
      tipoContrato: "01" // Valor por defecto
    };
  },
  createEmployee: async (employee) => {
    // TODO: Implementar con backend
    return {
      id: 1,
      ...employee
    };
  },
  updateEmployee: async (id, employee) => {
    // TODO: Implementar con backend
    return {
      id,
      nombre: "",
      cedula: "",
      posicion: "",
      salario: 0,
      fechaIngreso: new Date().toISOString(),
      estado: "activo",
      tipoContrato: "01", // Valor por defecto
      ...employee
    };
  },
  deleteEmployee: async (id: number) => {
    // TODO: Implementar con backend
    console.log(`Deleting employee ${id}`);
  },
  
  // Payroll services
  createPayroll: async (payroll) => {
    // Validar deducciones contra límites
    const deductions = calculatePayrollDeductions(payroll.salarioBase);
    const validationResult = validateDeductions(
      payroll.salarioBase,
      deductions.afp,
      deductions.ars,
      deductions.isr
    );

    if (!validationResult.valid) {
      throw new Error(validationResult.errors.join(", "));
    }

    // TODO: Implementar con backend
    return {
      id: 1,
      ...payroll,
      ...deductions,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
  },
  getPayrollDetails: async (id) => {
    // TODO: Implementar con backend
    const calculo = calcularSalarioNeto(50000); // Ejemplo con salario base
    return {
      id,
      empleadoId: 1,
      periodo: {
        inicio: new Date().toISOString(),
        fin: new Date().toISOString(),
        fechaPago: new Date().toISOString()
      },
      salarioBase: 50000,
      bonificaciones: [],
      deducciones: [],
      afp: calculo.tssEmpleado.afp,
      ars: calculo.tssEmpleado.sfs,
      isr: calculo.isr,
      salarioNeto: calculo.neto,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      tssEmpleado: calculo.tssEmpleado,
      tssEmpleador: calculo.tssEmpleador
    };
  },
  getPayrollHistory: async (filters) => {
    // TODO: Implementar con backend
    console.log('Filters:', filters);
    return [];
  },
  exportPayroll: async (id: number, format: "tss" | "pdf") => {
    // TODO: Implementar con backend
    console.log(`Exporting payroll ${id} in ${format} format`);
    return new Blob();
  },
  calculatePayroll: async (employeeId: number) => {
    // TODO: Implementar con backend
    const employee = await payrollServices.getEmployee(employeeId);
    const calculo = calcularSalarioNeto(employee.salario);

    return {
      id: 0,
      empleadoId: employeeId,
      periodo: {
        inicio: new Date().toISOString(),
        fin: new Date().toISOString(),
        fechaPago: new Date().toISOString()
      },
      salarioBase: employee.salario,
      bonificaciones: [],
      deducciones: [],
      afp: calculo.tssEmpleado.afp,
      ars: calculo.tssEmpleado.sfs,
      isr: calculo.isr,
      salarioNeto: calculo.neto,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      tssEmpleado: calculo.tssEmpleado,
      tssEmpleador: calculo.tssEmpleador
    };
  }
};