import type { Employee } from "./employeesData";

const API_URL = "/api/payroll";

// Clase personalizada para errores de la API
export class PayrollAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "PayrollAPIError";
  }
}

export const payrollServices = {
  // Obtener todos los empleados
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const response = await fetch(`${API_URL}/employees`);
      if (!response.ok) {
        throw new PayrollAPIError(
          "Error al obtener la lista de empleados",
          response.status
        );
      }
      return response.json();
    } catch (error) {
      console.error("Error en getEmployees:", error);
      throw new PayrollAPIError(
        "No se pudo obtener la lista de empleados. Por favor, intente nuevamente."
      );
    }
  },

  // Obtener un empleado por ID
  getEmployee: async (id: number): Promise<Employee> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new PayrollAPIError("Empleado no encontrado", 404);
        }
        throw new PayrollAPIError(
          "Error al obtener los datos del empleado",
          response.status
        );
      }
      return response.json();
    } catch (error) {
      console.error("Error en getEmployee:", error);
      throw new PayrollAPIError(
        "No se pudo obtener la información del empleado. Por favor, intente nuevamente."
      );
    }
  },

  // Crear nuevo empleado
  createEmployee: async (employee: Omit<Employee, "id">): Promise<Employee> => {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        if (response.status === 409) {
          throw new PayrollAPIError(
            "Ya existe un empleado con esta cédula",
            409
          );
        }
        throw new PayrollAPIError(
          "Error al crear el empleado",
          response.status
        );
      }
      return response.json();
    } catch (error) {
      console.error("Error en createEmployee:", error);
      throw new PayrollAPIError(
        "No se pudo crear el empleado. Por favor, verifique los datos e intente nuevamente."
      );
    }
  },

  // Actualizar empleado
  updateEmployee: async (
    id: number,
    employee: Partial<Employee>
  ): Promise<Employee> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new PayrollAPIError("Empleado no encontrado", 404);
        }
        if (response.status === 409) {
          throw new PayrollAPIError(
            "Ya existe un empleado con esta cédula",
            409
          );
        }
        throw new PayrollAPIError(
          "Error al actualizar el empleado",
          response.status
        );
      }
      return response.json();
    } catch (error) {
      console.error("Error en updateEmployee:", error);
      throw new PayrollAPIError(
        "No se pudo actualizar el empleado. Por favor, verifique los datos e intente nuevamente."
      );
    }
  },

  // Eliminar empleado
  deleteEmployee: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new PayrollAPIError("Empleado no encontrado", 404);
        }
        throw new PayrollAPIError(
          "Error al eliminar el empleado",
          response.status
        );
      }
    } catch (error) {
      console.error("Error en deleteEmployee:", error);
      throw new PayrollAPIError(
        "No se pudo eliminar el empleado. Por favor, intente nuevamente."
      );
    }
  },

  // Calcular nómina
  calculatePayroll: async (
    employeeId: number
  ): Promise<{
    afp: number;
    ars: number;
    isr: number;
    salarioNeto: number;
  }> => {
    try {
      const response = await fetch(`${API_URL}/calculate/${employeeId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new PayrollAPIError("Empleado no encontrado", 404);
        }
        throw new PayrollAPIError(
          "Error al calcular la nómina",
          response.status
        );
      }
      return response.json();
    } catch (error) {
      console.error("Error en calculatePayroll:", error);
      throw new PayrollAPIError(
        "No se pudo calcular la nómina. Por favor, intente nuevamente."
      );
    }
  },
};
