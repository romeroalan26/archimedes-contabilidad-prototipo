export default function BalanceSheet() {
  const activos = 120000;
  const pasivos = 50000;
  const patrimonio = activos - pasivos;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Balance General</h3>
      <ul className="text-sm space-y-1">
        <li>
          Activos:{" "}
          <span className="font-bold text-green-700">
            ${activos.toLocaleString()}
          </span>
        </li>
        <li>
          Pasivos:{" "}
          <span className="font-bold text-red-700">
            ${pasivos.toLocaleString()}
          </span>
        </li>
        <li>
          Patrimonio:{" "}
          <span className="font-bold text-blue-700">
            ${patrimonio.toLocaleString()}
          </span>
        </li>
      </ul>
    </div>
  );
}
