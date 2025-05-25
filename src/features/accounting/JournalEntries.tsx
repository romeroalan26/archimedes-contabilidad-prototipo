interface Detalle {
  cuenta: string;
  debe: number;
  haber: number;
}

interface Asiento {
  fecha: string;
  descripcion: string;
  detalles: Detalle[];
}

const asientos: Asiento[] = [
  {
    fecha: "2025-03-01",
    descripcion: "Venta de materiales",
    detalles: [
      { cuenta: "Caja", debe: 15000, haber: 0 },
      { cuenta: "Ingresos por ventas", debe: 0, haber: 15000 },
    ],
  },
  {
    fecha: "2025-03-03",
    descripcion: "Compra de cemento",
    detalles: [
      { cuenta: "Inventario", debe: 10000, haber: 0 },
      { cuenta: "Cuentas por pagar", debe: 0, haber: 10000 },
    ],
  },
];

export default function JournalEntries() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Libro Diario
      </h3>
      {asientos.map((a, i) => (
        <div key={i} className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {a.fecha} - {a.descripcion}
          </p>
          <table className="w-full text-sm mt-1">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="text-gray-700 dark:text-gray-300">Cuenta</th>
                <th className="text-gray-700 dark:text-gray-300">Debe</th>
                <th className="text-gray-700 dark:text-gray-300">Haber</th>
              </tr>
            </thead>
            <tbody>
              {a.detalles.map((d, j) => (
                <tr
                  key={j}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="text-gray-900 dark:text-gray-100">
                    {d.cuenta}
                  </td>
                  <td className="text-gray-900 dark:text-gray-100">
                    {d.debe ? `$${d.debe.toLocaleString()}` : ""}
                  </td>
                  <td className="text-gray-900 dark:text-gray-100">
                    {d.haber ? `$${d.haber.toLocaleString()}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
