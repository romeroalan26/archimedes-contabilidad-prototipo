export default function Report607() {
  const ventas = [
    { cliente: "Constructora Norte", ncf: "B020000001", monto: 24000 },
    { cliente: "Inversiones Sur", ncf: "B020000002", monto: 32000 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">607 - Reporte de Ventas</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Cliente</th>
            <th>NCF</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v, i) => (
            <tr key={i} className="border-b">
              <td>{v.cliente}</td>
              <td>{v.ncf}</td>
              <td>${v.monto.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
