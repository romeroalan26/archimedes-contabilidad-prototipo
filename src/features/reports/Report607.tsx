export default function Report607() {
  const ventas = [
    { cliente: "Constructora Norte", ncf: "B020000001", monto: 24000 },
    { cliente: "Inversiones Sur", ncf: "B020000002", monto: 32000 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        607 - Reporte de Ventas
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="text-gray-700 dark:text-gray-300">Cliente</th>
            <th className="text-gray-700 dark:text-gray-300">NCF</th>
            <th className="text-gray-700 dark:text-gray-300">Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="text-gray-900 dark:text-gray-100">{v.cliente}</td>
              <td className="text-gray-900 dark:text-gray-100">{v.ncf}</td>
              <td className="text-gray-900 dark:text-gray-100">
                ${v.monto.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
