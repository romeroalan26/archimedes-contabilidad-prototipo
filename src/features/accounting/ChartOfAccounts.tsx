interface Cuenta {
  codigo: string;
  nombre: string;
}

const cuentas: Cuenta[] = [
  { codigo: "1", nombre: "Activo" },
  { codigo: "1.1", nombre: "Activo Corriente" },
  { codigo: "1.1.1", nombre: "Caja" },
  { codigo: "1.1.2", nombre: "Banco" },
  { codigo: "2", nombre: "Pasivo" },
  { codigo: "2.1", nombre: "Pasivo Corriente" },
  { codigo: "2.1.1", nombre: "Cuentas por Pagar" },
  { codigo: "3", nombre: "Patrimonio" },
  { codigo: "4", nombre: "Ingresos" },
  { codigo: "5", nombre: "Costos" },
  { codigo: "6", nombre: "Gastos" },
];

export default function ChartOfAccounts() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Catálogo de Cuentas (NIIF)</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Código</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((c) => (
            <tr key={c.codigo} className="border-b">
              <td>{c.codigo}</td>
              <td>{c.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
