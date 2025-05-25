interface Cuenta {
  cuenta: string;
  debe: number;
  haber: number;
}

const cuentas: Cuenta[] = [
  { cuenta: "Caja", debe: 13000, haber: 0 },
  { cuenta: "Cuentas por pagar", debe: 0, haber: 6000 },
  { cuenta: "Ingresos por ventas", debe: 0, haber: 15000 },
  { cuenta: "Inventario", debe: 10000, haber: 0 },
];

export default function TrialBalance() {
  const totalDebe = cuentas.reduce((acc, c) => acc + c.debe, 0);
  const totalHaber = cuentas.reduce((acc, c) => acc + c.haber, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Balance de Comprobación
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="text-gray-700 dark:text-gray-300">Cuenta</th>
            <th className="text-gray-700 dark:text-gray-300">Debe</th>
            <th className="text-gray-700 dark:text-gray-300">Haber</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="text-gray-900 dark:text-gray-100">{c.cuenta}</td>
              <td className="text-gray-900 dark:text-gray-100">
                {c.debe ? `$${c.debe.toLocaleString()}` : ""}
              </td>
              <td className="text-gray-900 dark:text-gray-100">
                {c.haber ? `$${c.haber.toLocaleString()}` : ""}
              </td>
            </tr>
          ))}
          <tr className="font-bold border-t border-gray-300 dark:border-gray-600">
            <td className="text-gray-900 dark:text-gray-100">Total</td>
            <td className="text-gray-900 dark:text-gray-100">
              ${totalDebe.toLocaleString()}
            </td>
            <td className="text-gray-900 dark:text-gray-100">
              ${totalHaber.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
