export default function Report608() {
  const anulaciones = [
    { ncf: "B020000010", motivo: "Error de digitación" },
    { ncf: "B020000011", motivo: "Duplicado" },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">608 - Comprobantes Anulados</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>NCF</th>
            <th>Motivo</th>
          </tr>
        </thead>
        <tbody>
          {anulaciones.map((a, i) => (
            <tr key={i} className="border-b">
              <td>{a.ncf}</td>
              <td>{a.motivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
