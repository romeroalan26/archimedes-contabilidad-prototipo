export default function Report606() {
  const compras = [
    { proveedor: "Materiales Rivera", ncf: "B0100000001", monto: 15000 },
    { proveedor: "Ferretería La Roca", ncf: "B0100000002", monto: 18500 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">606 - Reporte de Compras</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Proveedor</th>
            <th>NCF</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c, i) => (
            <tr key={i} className="border-b">
              <td>{c.proveedor}</td>
              <td>{c.ncf}</td>
              <td>${c.monto.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
