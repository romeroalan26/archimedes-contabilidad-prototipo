const cuentasPorPagar = [
  { fecha: "2024-03-02", descripcion: "Factura #A101", monto: 10000 },
  { fecha: "2024-03-10", descripcion: "Abono realizado", monto: -4000 },
  { fecha: "2024-03-18", descripcion: "Factura #A102", monto: 18000 },
];

export default function PayableStatus() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Estado de Cuenta del Proveedor
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {cuentasPorPagar.map((m, idx) => (
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
