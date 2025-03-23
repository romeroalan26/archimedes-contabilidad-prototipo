import type { Employee } from "../../types/employee";
import { useEmployees } from "../../hooks";
import { formatCurrency } from "../../utils/format";

export function EmployeeList() {
  const { data: employees, isLoading, error } = useEmployees();

  if (isLoading) return <div>Cargando empleados...</div>;
  if (error) return <div>Error al cargar empleados</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cédula
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posición
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Salario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees?.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">{employee.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.cedula}</td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.posicion}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCurrency(employee.salario)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.estado === "activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 