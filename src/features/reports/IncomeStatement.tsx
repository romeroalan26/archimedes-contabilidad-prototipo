export default function IncomeStatement() {
  const ingresos = 95000;
  const costos = 43000;
  const utilidad = ingresos - costos;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Estado de Resultados
      </h3>
      <ul className="text-sm space-y-1">
        <li className="text-gray-900 dark:text-gray-100">
          Ingresos:{" "}
          <span className="font-bold text-green-700 dark:text-green-400">
            ${ingresos.toLocaleString()}
          </span>
        </li>
        <li className="text-gray-900 dark:text-gray-100">
          Costos:{" "}
          <span className="font-bold text-red-700 dark:text-red-400">
            ${costos.toLocaleString()}
          </span>
        </li>
        <li className="text-gray-900 dark:text-gray-100">
          Utilidad:{" "}
          <span className="font-bold text-blue-700 dark:text-blue-400">
            ${utilidad.toLocaleString()}
          </span>
        </li>
      </ul>
    </div>
  );
}
