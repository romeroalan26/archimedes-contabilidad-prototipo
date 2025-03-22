const movimientos = [
  { fecha: "2024-03-01", descripcion: "Factura #001", monto: 12000 },
  { fecha: "2024-03-05", descripcion: "Pago recibido", monto: -5000 },
  { fecha: "2024-03-15", descripcion: "Factura #002", monto: 15000 },
];

export default function AccountStatement() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Estado de Cuenta</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-1">{m.fecha}</td>
              <td>{m.descripcion}</td>
              <td className={m.monto < 0 ? "text-green-600" : "text-red-600"}>
                {m.monto < 0 ? `- $${-m.monto}` : `$${m.monto}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
