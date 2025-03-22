import { useEmployees, useDeleteEmployee } from "./hooks";
import type { Employee } from "./employeesData";

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async (employee: Employee) => {
    const confirmMessage = `¿Está seguro que desea eliminar a ${employee.nombre}? Esta acción no se puede deshacer.`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteEmployee.mutateAsync(employee.id);
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
        // Aquí se podría agregar una notificación de error
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando empleados...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Lista de Empleados
        </h3>
      </div>
      <div className="overflow-x-auto">
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees?.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {employee.nombre}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.cedula}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {employee.posicion}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    RD$ {employee.salario.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(employee)}
                    className="text-red-600 hover:text-red-900"
                    disabled={deleteEmployee.isPending}
                  >
                    {deleteEmployee.isPending ? "Eliminando..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
