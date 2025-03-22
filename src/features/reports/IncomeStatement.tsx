export default function IncomeStatement() {
  const ingresos = 95000;
  const costos = 43000;
  const utilidad = ingresos - costos;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Estado de Resultados</h3>
      <ul className="text-sm space-y-1">
        <li>
          Ingresos:{" "}
          <span className="font-bold text-green-700">
            ${ingresos.toLocaleString()}
          </span>
        </li>
        <li>
          Costos:{" "}
          <span className="font-bold text-red-700">
            ${costos.toLocaleString()}
          </span>
        </li>
        <li>
          Utilidad:{" "}
          <span className="font-bold text-blue-700">
            ${utilidad.toLocaleString()}
          </span>
        </li>
      </ul>
    </div>
  );
}
