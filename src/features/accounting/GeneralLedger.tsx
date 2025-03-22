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
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Libro Mayor</h3>
      {cuentas.map((c, i) => (
        <div key={i} className="mb-4">
          <p className="font-semibold">{c.nombre}</p>
          <table className="w-full text-sm mt-1">
            <thead>
              <tr className="text-left border-b">
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {c.movimientos.map((m, j) => (
                <tr key={j} className="border-b">
                  <td>{m.fecha}</td>
                  <td>{m.tipo}</td>
                  <td>${m.monto.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
