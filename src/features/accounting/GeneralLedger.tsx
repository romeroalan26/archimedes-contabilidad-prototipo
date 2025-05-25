interface Movimiento {
  fecha: string;
  tipo: "Debe" | "Haber";
  monto: number;
}

interface Cuenta {
  nombre: string;
  movimientos: Movimiento[];
}

const cuentas: Cuenta[] = [
  {
    nombre: "Caja",
    movimientos: [
      { fecha: "2025-03-01", tipo: "Debe", monto: 15000 },
      { fecha: "2025-03-05", tipo: "Haber", monto: 2000 },
    ],
  },
  {
    nombre: "Cuentas por pagar",
    movimientos: [
      { fecha: "2025-03-03", tipo: "Haber", monto: 10000 },
      { fecha: "2025-03-06", tipo: "Debe", monto: 4000 },
    ],
  },
];

export default function GeneralLedger() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Libro Mayor
      </h3>
      {cuentas.map((c, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {c.nombre}
          </p>
          <table className="w-full text-sm mt-1">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="text-gray-700 dark:text-gray-300">Fecha</th>
                <th className="text-gray-700 dark:text-gray-300">Tipo</th>
                <th className="text-gray-700 dark:text-gray-300">Monto</th>
              </tr>
            </thead>
            <tbody>
              {c.movimientos.map((m, j) => (
                <tr
                  key={j}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="text-gray-900 dark:text-gray-100">
                    {m.fecha}
                  </td>
                  <td className="text-gray-900 dark:text-gray-100">{m.tipo}</td>
                  <td className="text-gray-900 dark:text-gray-100">
                    ${m.monto.toLocaleString()}
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
