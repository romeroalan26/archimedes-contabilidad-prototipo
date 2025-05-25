import { useState, /* useEffect, */ useMemo } from "react";
import { useAuth } from "../../../stores/authStore";

// Types for Payroll Management
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: "active" | "inactive" | "vacation" | "medical_leave";
  cedula: string;
  email: string;
  phone: string;
  bankAccount: string;
  benefits: {
    healthInsurance: boolean;
    lifeInsurance: boolean;
    pension: boolean;
  };
}

// interface PayrollEntry {
//   id: string;
//   employeeId: string;
//   period: string;
//   baseSalary: number;
//   overtime: number;
//   bonuses: number;
//   deductions: {
//     afp: number;
//     ars: number;
//     isr: number;
//     other: number;
//   };
//   netSalary: number;
//   status: "pending" | "paid" | "cancelled";
//   processedAt: string;
// }

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "María Rodríguez",
    position: "Contadora Senior",
    department: "Contabilidad",
    hireDate: "2021-03-15",
    salary: 75000,
    status: "active",
    cedula: "001-1234567-8",
    email: "maria.rodriguez@empresa.com",
    phone: "(809) 555-0123",
    bankAccount: "1234567890",
    benefits: {
      healthInsurance: true,
      lifeInsurance: true,
      pension: true,
    },
  },
  {
    id: "2",
    name: "Carlos Martínez",
    position: "Analista Financiero",
    department: "Finanzas",
    hireDate: "2022-01-10",
    salary: 55000,
    status: "active",
    cedula: "001-2345678-9",
    email: "carlos.martinez@empresa.com",
    phone: "(809) 555-0124",
    bankAccount: "2345678901",
    benefits: {
      healthInsurance: true,
      lifeInsurance: true,
      pension: true,
    },
  },
  {
    id: "3",
    name: "Ana López",
    position: "Asistente Administrativa",
    department: "Administración",
    hireDate: "2023-06-01",
    salary: 35000,
    status: "vacation",
    cedula: "001-3456789-0",
    email: "ana.lopez@empresa.com",
    phone: "(809) 555-0125",
    bankAccount: "3456789012",
    benefits: {
      healthInsurance: true,
      lifeInsurance: false,
      pension: true,
    },
  },
  {
    id: "4",
    name: "Roberto Jiménez",
    position: "Gerente de Ventas",
    department: "Ventas",
    hireDate: "2020-09-20",
    salary: 95000,
    status: "active",
    cedula: "001-4567890-1",
    email: "roberto.jimenez@empresa.com",
    phone: "(809) 555-0126",
    bankAccount: "4567890123",
    benefits: {
      healthInsurance: true,
      lifeInsurance: true,
      pension: true,
    },
  },
];

// const mockPayrollEntries: PayrollEntry[] = [
//   {
//     id: "pay-001",
//     employeeId: "emp-001",
//     period: "2024-01",
//     baseSalary: 45000,
//     overtime: 5000,
//     bonuses: 2000,
//     deductions: 7500,
//     netPay: 44500,
//     status: "paid",
//     processedDate: "2024-01-31",
//   },
//   {
//     id: "pay-002",
//     employeeId: "emp-002",
//     period: "2024-01",
//     baseSalary: 35000,
//     overtime: 0,
//     bonuses: 1000,
//     deductions: 5400,
//     netPay: 30600,
//     status: "paid",
//     processedDate: "2024-01-31",
//   },
// ];

export function PayrollPage() {
  const {
    /* user */
  } = useAuth();
  const [employees] = useState<Employee[]>(mockEmployees);
  // const [payrollEntries] = useState<PayrollEntry[]>(mockPayrollEntries);
  const [activeTab, setActiveTab] = useState<
    "employees" | "payroll" | "reports"
  >("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showPayrollProcess, setShowPayrollProcess] = useState(false);

  // Calculate KPIs
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "active"
  ).length;
  const totalSalaryBudget = employees.reduce((sum, emp) => sum + emp.salary, 0);
  // const avgSalary = totalSalaryBudget / employees.length;
  const employeesOnLeave = employees.filter(
    (emp) => emp.status === "vacation" || emp.status === "medical_leave"
  ).length;

  // Get unique departments for filter
  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(employees.map((emp) => emp.department)),
    ];
    return uniqueDepartments;
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.cedula.includes(searchTerm);
      const matchesDepartment =
        departmentFilter === "all" || employee.department === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "inactive":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "vacation":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "medical_leave":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "vacation":
        return "Vacaciones";
      case "medical_leave":
        return "Licencia Médica";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Módulo de Nómina
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona empleados, procesa nóminas y controla pagos de tu
                empresa
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowEmployeeForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nuevo Empleado
              </button>
              <button
                onClick={() => setShowPayrollProcess(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Procesar Nómina
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Empleados
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalEmployees}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Empleados Activos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeEmployees}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Nómina Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalSalaryBudget)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  En Licencia
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {employeesOnLeave}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("employees")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "employees"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Gestión de Empleados
              </button>
              <button
                onClick={() => setActiveTab("payroll")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payroll"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Procesamiento de Nómina
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Reportes y Análisis
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Gestión de Empleados Tab */}
            {activeTab === "employees" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buscar Empleado
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nombre, cédula o cargo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="h-5 w-5 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Departamento
                    </label>
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    >
                      <option value="all">Todos los departamentos</option>
                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="vacation">Vacaciones</option>
                      <option value="medical_leave">Licencia Médica</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowEmployeeForm(true)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium"
                    >
                      Nuevo Empleado
                    </button>
                  </div>
                </div>

                {/* Employees Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Empleado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cargo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Departamento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Salario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            F. Ingreso
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {employee.cedula}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {employee.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                {employee.department}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(employee.salary)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(employee.status)}`}
                              >
                                {getStatusLabel(employee.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(employee.hireDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                  Ver
                                </button>
                                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                  Editar
                                </button>
                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Procesamiento de Nómina Tab */}
            {activeTab === "payroll" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Procesamiento de Nómina
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Período Actual
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Período:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Enero 2024
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Empleados:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {activeEmployees}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Bruto:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(totalSalaryBudget)}
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-600">
                            Procesar Nómina
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                        Última Nómina Procesada
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Período:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Diciembre 2023
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Pagado:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(107205)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Estado:
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Completado
                          </span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reportes y Análisis Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Reportes y Análisis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Reporte de Nómina
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Resumen detallado de pagos por período
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Análisis Salarial
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Distribución de salarios por departamento
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Deducciones Fiscales
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Reporte de AFP, ARS e ISR por empleado
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Horas Extras
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Control de tiempo extra y compensaciones
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Rotación de Personal
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Análisis de contrataciones y desvinculaciones
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Beneficios
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Reporte de beneficios asignados por empleado
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal placeholder para nuevo empleado */}
      {showEmployeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Nuevo Empleado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El formulario para registrar nuevos empleados estará disponible
              próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowEmployeeForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal placeholder para procesar nómina */}
      {showPayrollProcess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Procesar Nómina
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El módulo de procesamiento de nómina estará disponible
              próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPayrollProcess(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
