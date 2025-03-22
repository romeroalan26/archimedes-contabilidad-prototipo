export default function CashFlow() {
  const ingresos = 55000;
  const egresos = 32000;
  const balance = ingresos - egresos;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Flujo de Caja</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm">Ingresos</p>
          <p className="text-xl font-bold text-green-800">
            ${ingresos.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <p className="text-sm">Egresos</p>
          <p className="text-xl font-bold text-red-800">
            ${egresos.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-sm">Balance</p>
          <p className="text-xl font-bold text-blue-800">
            ${balance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
