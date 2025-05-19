import type { Employee } from "../types/employee";
import type { PayrollDetails } from "../types/payroll";
import { validateDeductions } from "../utils/validations";
import {
  calculatePayrollDeductions,
  calcularSalarioNeto,
} from "../utils/calculations";
import { mockPayrolls } from "../__mocks__/mockPayrolls";
import { exportToPDF, exportToTSS } from "../utils/export";
import { mockEmployees } from "../__mocks__/mockEmployees";

export interface PayrollServices {
  // Employee services
  getEmployees: () => Promise<Employee[]>;
  getEmployee: (id: number) => Promise<Employee>;
  createEmployee: (employee: Omit<Employee, "id">) => Promise<Employee>;
  updateEmployee: (
    id: number,
    employee: Partial<Employee>
  ) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;

  // Payroll services
  createPayroll: (
    payroll: Omit<PayrollDetails, "id">
  ) => Promise<PayrollDetails>;
  getPayrollDetails: (id: number) => Promise<PayrollDetails>;
  getPayrollHistory: (filters?: {
    empleadoId?: number;
    periodoInicio?: string;
    periodoFin?: string;
  }) => Promise<PayrollDetails[]>;
  exportPayroll: (id: number, format: "tss" | "pdf") => Promise<Blob>;
  calculatePayroll: (employeeId: number) => Promise<PayrollDetails>;
}

// Clase personalizada para errores de la API
export class PayrollAPIError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
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
    const employee = mockEmployees.find((emp) => emp.id === id);
    if (!employee) {
      throw new PayrollAPIError("Empleado no encontrado", 404);
    }
    return employee;
  },
  createEmployee: async (employee) => {
    // TODO: Implementar con backend
    return {
      id: 1,
      ...employee,
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
      estado: "ACTIVO",
      tipoContrato: "indefinido",
      ...employee,
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
      estado: "PENDIENTE",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
  },
  getPayrollDetails: async (id) => {
    // TODO: Implementar con backend
    const payroll = mockPayrolls.find((p) => p.id === id);
    if (!payroll) {
      throw new PayrollAPIError("Nómina no encontrada", 404);
    }
    return payroll;
  },
  getPayrollHistory: async (filters) => {
    // TODO: Implementar con backend
    let filteredPayrolls = [...mockPayrolls];

    if (filters?.empleadoId) {
      filteredPayrolls = filteredPayrolls.filter(
        (p) => p.empleadoId === filters.empleadoId
      );
    }

    if (filters?.periodoInicio && typeof filters.periodoInicio === "string") {
      filteredPayrolls = filteredPayrolls.filter(
        (p) => p.periodo.inicio >= (filters.periodoInicio as string)
      );
    }

    if (filters?.periodoFin && typeof filters.periodoFin === "string") {
      filteredPayrolls = filteredPayrolls.filter(
        (p) => p.periodo.fin <= (filters.periodoFin as string)
      );
    }

    return filteredPayrolls;
  },
  exportPayroll: async (id: number, format: "tss" | "pdf") => {
    // TODO: Implementar con backend
    const payroll = mockPayrolls.find((p) => p.id === id);
    if (!payroll) {
      throw new PayrollAPIError("Nómina no encontrada", 404);
    }

    if (format === "pdf") {
      return exportToPDF(payroll);
    } else {
      return exportToTSS(payroll);
    }
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
        fechaPago: new Date().toISOString(),
      },
      salarioBase: employee.salario,
      bonificaciones: [],
      deducciones: [],
      afp: calculo.tssEmpleado.afp,
      ars: calculo.tssEmpleado.sfs,
      isr: calculo.isr,
      salarioNeto: calculo.neto,
      estado: "PENDIENTE",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      tssEmpleado: calculo.tssEmpleado,
      tssEmpleador: calculo.tssEmpleador,
    };
  },
};
