import { useEmployees, useCalculatePayroll } from "./hooks";
import { Employee } from "./employeesData";

export function PayrollSummary() {
  const { data: employees, isLoading } = useEmployees();

  if (isLoading) {
    return <div className="text-center py-4">Cargando resumen...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Resumen de Nómina</h2>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700">Total Salarios</h3>
          <p className="text-2xl font-bold text-blue-900">
            RD${" "}
            {employees
              ?.reduce((total, employee) => total + employee.salario, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-700">Total AFP</h3>
          <p className="text-2xl font-bold text-red-900">
            RD${" "}
            {employees
              ?.reduce((total, employee) => {
                const payroll = useCalculatePayroll(employee.id).data;
                return total + (payroll?.afp || 0);
              }, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-700">Total ARS</h3>
          <p className="text-2xl font-bold text-yellow-900">
            RD${" "}
            {employees
              ?.reduce((total, employee) => {
                const payroll = useCalculatePayroll(employee.id).data;
                return total + (payroll?.ars || 0);
              }, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-700">Total ISR</h3>
          <p className="text-2xl font-bold text-green-900">
            RD${" "}
            {employees
              ?.reduce((total, employee) => {
                const payroll = useCalculatePayroll(employee.id).data;
                return total + (payroll?.isr || 0);
              }, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabla de Detalles */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AFP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ARS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Neto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees?.map((employee) => (
              <EmployeePayrollRow key={employee.id} employee={employee} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeePayrollRow({ employee }: { employee: Employee }) {
  const { data: payroll, isLoading } = useCalculatePayroll(employee.id);

  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="px-6 py-4 text-center">
          Cargando datos...
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {employee.nombre}
        </div>
        <div className="text-sm text-gray-500">{employee.posicion}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {employee.salario.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {payroll?.afp.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {payroll?.ars.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {payroll?.isr.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        RD$ {payroll?.salarioNeto.toFixed(2)}
      </td>
    </tr>
  );
}
