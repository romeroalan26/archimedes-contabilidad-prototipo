import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PayrollHistoryPage } from "../pages/PayrollHistoryPage";
import type { Employee } from "../types/employee";
import type { PayrollDetails } from "../types/payroll";

// Mock data específico para las pruebas
const mockEmployees: Employee[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "123-456-7890",
    fechaIngreso: "2023-01-15",
    posicion: "Desarrollador Senior",
    salario: 75000,
    estado: "ACTIVO",
    tipoContrato: "indefinido",
  },
  {
    id: 2,
    nombre: "María García",
    cedula: "987-654-3210",
    fechaIngreso: "2023-03-01",
    posicion: "Contadora",
    salario: 65000,
    estado: "ACTIVO",
    tipoContrato: "indefinido",
  },
];

const mockPayrolls: PayrollDetails[] = [
  {
    id: 1,
    empleadoId: 1,
    periodo: {
      inicio: "2025-03-01",
      fin: "2025-03-31",
      fechaPago: "2025-04-05",
    },
    salarioBase: 75000,
    bonificaciones: [],
    deducciones: [],
    afp: 3750,
    ars: 2250,
    isr: 7500,
    salarioNeto: 64500,
    estado: "APROBADO",
    fechaCreacion: "2025-03-01T00:00:00Z",
    fechaActualizacion: "2025-03-01T00:00:00Z",
    tssEmpleado: {
      afp: 3750,
      sfs: 2250,
    },
    tssEmpleador: {
      afp: 7500,
      sfs: 4500,
      infotep: 750,
      riesgoLaboral: 900,
    },
  },
  {
    id: 2,
    empleadoId: 1,
    periodo: {
      inicio: "2025-02-01",
      fin: "2025-02-28",
      fechaPago: "2025-03-05",
    },
    salarioBase: 75000,
    bonificaciones: [],
    deducciones: [],
    afp: 3750,
    ars: 2250,
    isr: 7500,
    salarioNeto: 64500,
    estado: "APROBADO",
    fechaCreacion: "2025-02-01T00:00:00Z",
    fechaActualizacion: "2025-02-01T00:00:00Z",
    tssEmpleado: {
      afp: 3750,
      sfs: 2250,
    },
    tssEmpleador: {
      afp: 7500,
      sfs: 4500,
      infotep: 750,
      riesgoLaboral: 900,
    },
  },
  {
    id: 3,
    empleadoId: 2,
    periodo: {
      inicio: "2025-03-01",
      fin: "2025-03-31",
      fechaPago: "2025-04-05",
    },
    salarioBase: 65000,
    bonificaciones: [],
    deducciones: [],
    afp: 3250,
    ars: 1950,
    isr: 6500,
    salarioNeto: 55250,
    estado: "APROBADO",
    fechaCreacion: "2025-03-01T00:00:00Z",
    fechaActualizacion: "2025-03-01T00:00:00Z",
    tssEmpleado: {
      afp: 3250,
      sfs: 1950,
    },
    tssEmpleador: {
      afp: 6500,
      sfs: 3900,
      infotep: 650,
      riesgoLaboral: 780,
    },
  },
];

// Mock de los hooks
jest.mock("../hooks", () => ({
  usePayrollHistory: () => ({
    data: mockPayrolls,
    isLoading: false,
    error: null,
  }),
  useEmployees: () => ({
    data: mockEmployees,
    isLoading: false,
    error: null,
  }),
}));

describe("PayrollHistoryPage Filters", () => {
  beforeEach(() => {
    render(<PayrollHistoryPage />);
  });

  it("should display all payrolls by default", () => {
    // Verificar que se muestran todas las nóminas
    mockPayrolls.forEach((payroll) => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });
  });

  it("should filter payrolls by employee", async () => {
    const user = userEvent.setup();
    const employeeSelect = screen.getByLabelText("Empleado");

    // Seleccionar el primer empleado
    await user.selectOptions(employeeSelect, "1");

    // Verificar que solo se muestran las nóminas del empleado seleccionado
    const employeePayrolls = mockPayrolls.filter((p) => p.empleadoId === 1);
    employeePayrolls.forEach((payroll) => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });

    // Verificar que no se muestran las nóminas de otros empleados
    const otherPayrolls = mockPayrolls.filter((p) => p.empleadoId !== 1);
    otherPayrolls.forEach((payroll) => {
      expect(screen.queryByText(payroll.id.toString())).not.toBeInTheDocument();
    });
  });

  it("should filter payrolls by date range", async () => {
    const user = userEvent.setup();
    const startDateInput = screen.getByLabelText("Fecha Inicio");
    const endDateInput = screen.getByLabelText("Fecha Fin");

    // Seleccionar rango de fechas (marzo 2025)
    await user.type(startDateInput, "2025-03-01");
    await user.type(endDateInput, "2025-03-31");

    // Verificar que solo se muestran las nóminas dentro del rango
    const marchPayrolls = mockPayrolls.filter((p) =>
      p.periodo.inicio.startsWith("2025-03")
    );
    marchPayrolls.forEach((payroll) => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });

    // Verificar que no se muestran las nóminas fuera del rango
    const otherPayrolls = mockPayrolls.filter(
      (p) => !p.periodo.inicio.startsWith("2025-03")
    );
    otherPayrolls.forEach((payroll) => {
      expect(screen.queryByText(payroll.id.toString())).not.toBeInTheDocument();
    });
  });

  it("should filter payrolls by both employee and date range", async () => {
    const user = userEvent.setup();
    const employeeSelect = screen.getByLabelText("Empleado");
    const startDateInput = screen.getByLabelText("Fecha Inicio");
    const endDateInput = screen.getByLabelText("Fecha Fin");

    // Seleccionar empleado y rango de fechas
    await user.selectOptions(employeeSelect, "1");
    await user.type(startDateInput, "2025-03-01");
    await user.type(endDateInput, "2025-03-31");

    // Verificar que solo se muestran las nóminas que coinciden con ambos filtros
    const filteredPayrolls = mockPayrolls.filter(
      (p) => p.empleadoId === 1 && p.periodo.inicio.startsWith("2025-03")
    );
    filteredPayrolls.forEach((payroll) => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });

    // Verificar que no se muestran las nóminas que no coinciden con los filtros
    const otherPayrolls = mockPayrolls.filter(
      (p) => !(p.empleadoId === 1 && p.periodo.inicio.startsWith("2025-03"))
    );
    otherPayrolls.forEach((payroll) => {
      expect(screen.queryByText(payroll.id.toString())).not.toBeInTheDocument();
    });
  });

  it("should show no results message when filters return no matches", async () => {
    const user = userEvent.setup();
    const employeeSelect = screen.getByLabelText("Empleado");
    const startDateInput = screen.getByLabelText("Fecha Inicio");
    const endDateInput = screen.getByLabelText("Fecha Fin");

    // Seleccionar filtros que no coincidan con ninguna nómina
    await user.selectOptions(employeeSelect, "1");
    await user.type(startDateInput, "2025-04-01");
    await user.type(endDateInput, "2025-04-30");

    // Verificar que se muestra el mensaje de no resultados
    expect(
      screen.getByText(
        "No se encontraron resultados para los filtros seleccionados."
      )
    ).toBeInTheDocument();

    // Verificar que no se muestran nóminas
    mockPayrolls.forEach((payroll) => {
      expect(screen.queryByText(payroll.id.toString())).not.toBeInTheDocument();
    });
  });

  it("should validate date range and show error message", async () => {
    const user = userEvent.setup();
    const startDateInput = screen.getByLabelText("Fecha Inicio");
    const endDateInput = screen.getByLabelText("Fecha Fin");

    // Seleccionar fechas inválidas (fin antes que inicio)
    await user.type(startDateInput, "2025-03-31");
    await user.type(endDateInput, "2025-03-01");

    // Verificar que se muestra el mensaje de error
    expect(
      screen.getByText(
        "La fecha de inicio no puede ser mayor que la fecha de fin"
      )
    ).toBeInTheDocument();

    // Verificar que los inputs tienen el estilo de error
    expect(startDateInput).toHaveClass("border-red-300");
    expect(endDateInput).toHaveClass("border-red-300");
  });
});
