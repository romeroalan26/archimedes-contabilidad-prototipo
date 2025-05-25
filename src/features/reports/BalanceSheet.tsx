export default function BalanceSheet() {
  const activos = 120000;
  const pasivos = 50000;
  const patrimonio = activos - pasivos;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Balance General
      </h3>
      <ul className="text-sm space-y-1">
        <li className="text-gray-900 dark:text-gray-100">
          Activos:{" "}
          <span className="font-bold text-green-700 dark:text-green-400">
            ${activos.toLocaleString()}
          </span>
        </li>
        <li className="text-gray-900 dark:text-gray-100">
          Pasivos:{" "}
          <span className="font-bold text-red-700 dark:text-red-400">
            ${pasivos.toLocaleString()}
          </span>
        </li>
        <li className="text-gray-900 dark:text-gray-100">
          Patrimonio:{" "}
          <span className="font-bold text-blue-700 dark:text-blue-400">
            ${patrimonio.toLocaleString()}
          </span>
        </li>
      </ul>
    </div>
  );
}
