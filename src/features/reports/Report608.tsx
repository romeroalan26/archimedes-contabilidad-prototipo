export default function Report608() {
  const anulaciones = [
    { ncf: "B020000010", motivo: "Error de digitación" },
    { ncf: "B020000011", motivo: "Duplicado" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
        608 - Comprobantes Anulados
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="text-gray-700 dark:text-gray-300">NCF</th>
            <th className="text-gray-700 dark:text-gray-300">Motivo</th>
          </tr>
        </thead>
        <tbody>
          {anulaciones.map((a, i) => (
            <tr
              key={i}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="text-gray-900 dark:text-gray-100">{a.ncf}</td>
              <td className="text-gray-900 dark:text-gray-100">{a.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
