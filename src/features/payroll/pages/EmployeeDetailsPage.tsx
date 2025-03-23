import { useParams } from "react-router-dom";
import { useEmployee, usePayrollByEmployee } from "../hooks";
import { formatCurrency } from "../utils/format";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  calculateTotalBonificaciones,
  calculateTotalDeducciones,
} from "../utils/calculations";
import type { PayrollDetails } from "../types/payroll";

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = Number(id);

  // Validar que el ID sea un número válido
  if (isNaN(employeeId)) {
    return <div className="text-red-500 p-4">ID de empleado inválido</div>;
  }

  const {
    data: employee,
    isLoading: isLoadingEmployee,
    error: employeeError,
  } = useEmployee(employeeId);
  const {
    data: payrolls,
    isLoading: isLoadingPayrolls,
    error: payrollsError,
  } = usePayrollByEmployee(employeeId);

  if (isLoadingEmployee || isLoadingPayrolls) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (employeeError) {
    return (
      <div className="text-red-500 p-4">
        Error al cargar los datos del empleado: {employeeError.message}
      </div>
    );
  }

  if (!employee) {
    return <div className="text-gray-500 p-4">Empleado no encontrado</div>;
  }

  const totalBonificaciones =
    payrolls?.reduce(
      (sum: number, p: PayrollDetails) => sum + calculateTotalBonificaciones(p),
      0
    ) || 0;
  const totalDeducciones =
    payrolls?.reduce(
      (sum: number, p: PayrollDetails) => sum + calculateTotalDeducciones(p),
      0
    ) || 0;

  return (
    <div className="space-y-6 p-6">
      {/* Información del Empleado */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalles del Empleado
          </h2>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              employee.estado === "ACTIVO"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {employee.estado}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Nombre Completo</p>
            <p className="font-medium text-lg">{employee.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cédula</p>
            <p className="font-medium text-lg">{employee.cedula}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Posición</p>
            <p className="font-medium text-lg">{employee.posicion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salario Base</p>
            <p className="font-medium text-lg text-blue-600">
              {formatCurrency(employee.salario)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipo de Contrato</p>
            <p className="font-medium text-lg capitalize">
              {employee.tipoContrato}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de Ingreso</p>
            <p className="font-medium text-lg">
              {format(new Date(employee.fechaIngreso), "dd/MM/yyyy", {
                locale: es,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de Nómina */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Historial de Nómina
        </h2>

        {payrollsError ? (
          <div className="text-red-500">
            Error al cargar el historial: {payrollsError.message}
          </div>
        ) : !payrolls?.length ? (
          <div className="text-gray-500 text-center py-8">
            Este empleado no tiene nóminas registradas
          </div>
        ) : (
          <>
            {/* Resumen de Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Bonificaciones</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(totalBonificaciones)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Deducciones</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(totalDeducciones)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Promedio Salario Neto</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(
                    payrolls.reduce(
                      (sum: number, p: PayrollDetails) => sum + p.salarioNeto,
                      0
                    ) / payrolls.length
                  )}
                </p>
              </div>
            </div>

            {/* Tabla de Nóminas */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salario Base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonificaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deducciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salario Neto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrolls.map((payroll: PayrollDetails) => (
                    <tr key={payroll.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(
                          new Date(payroll.periodo.inicio),
                          "dd/MM/yyyy",
                          { locale: es }
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payroll.salarioBase)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {formatCurrency(calculateTotalBonificaciones(payroll))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {formatCurrency(calculateTotalDeducciones(payroll))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payroll.salarioNeto)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            payroll.estado === "APROBADO"
                              ? "bg-green-100 text-green-800"
                              : payroll.estado === "PENDIENTE"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payroll.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
