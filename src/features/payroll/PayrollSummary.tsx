import { empleadosSimulados } from "./employeesData";

const calcularISR = (salario: number): number => {
  if (salario <= 34685) return 0;
  if (salario <= 50000) return salario * 0.15;
  return salario * 0.25;
};

export default function PayrollSummary() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Resumen de Nómina</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Empleado</th>
            <th>Salario</th>
            <th>ARS (3.04%)</th>
            <th>AFP (2.87%)</th>
            <th>ISR</th>
            <th>Salario Neto</th>
          </tr>
        </thead>
        <tbody>
          {empleadosSimulados.map((emp) => {
            const ars = emp.salario * 0.0304;
            const afp = emp.salario * 0.0287;
            const isr = calcularISR(emp.salario);
            const neto = emp.salario - ars - afp - isr;

            return (
              <tr key={emp.id} className="border-b">
                <td>{emp.nombre}</td>
                <td>${emp.salario.toLocaleString()}</td>
                <td>${ars.toFixed(2)}</td>
                <td>${afp.toFixed(2)}</td>
                <td>${isr.toFixed(2)}</td>
                <td>${neto.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
