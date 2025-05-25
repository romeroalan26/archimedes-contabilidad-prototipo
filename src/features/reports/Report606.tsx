export default function Report606() {
  const compras = [
    { proveedor: "Materiales Rivera", ncf: "B0100000001", monto: 15000 },
    { proveedor: "Ferretería La Roca", ncf: "B0100000002", monto: 18500 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        606 - Reporte de Compras
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="text-gray-700 dark:text-gray-300">Proveedor</th>
            <th className="text-gray-700 dark:text-gray-300">NCF</th>
            <th className="text-gray-700 dark:text-gray-300">Monto</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="text-gray-900 dark:text-gray-100">
                {c.proveedor}
              </td>
              <td className="text-gray-900 dark:text-gray-100">{c.ncf}</td>
              <td className="text-gray-900 dark:text-gray-100">
                ${c.monto.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
