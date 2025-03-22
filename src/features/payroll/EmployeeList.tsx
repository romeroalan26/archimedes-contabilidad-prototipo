import { empleadosSimulados } from "./employeesData";

export default function EmployeeList() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Empleados Registrados</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Posición</th>
            <th>Salario Base</th>
          </tr>
        </thead>
        <tbody>
          {empleadosSimulados.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td>{emp.nombre}</td>
              <td>{emp.cedula}</td>
              <td>{emp.posicion}</td>
              <td>${emp.salario.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
