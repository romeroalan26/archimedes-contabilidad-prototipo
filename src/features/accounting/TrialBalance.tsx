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
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Balance de Comprobación</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Cuenta</th>
            <th>Debe</th>
            <th>Haber</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c, i) => (
            <tr key={i} className="border-b">
              <td>{c.cuenta}</td>
              <td>{c.debe ? `$${c.debe.toLocaleString()}` : ""}</td>
              <td>{c.haber ? `$${c.haber.toLocaleString()}` : ""}</td>
            </tr>
          ))}
          <tr className="font-bold border-t">
            <td>Total</td>
            <td>${totalDebe.toLocaleString()}</td>
            <td>${totalHaber.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
