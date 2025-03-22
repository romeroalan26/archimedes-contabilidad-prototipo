import { useState } from "react";

export default function BankReconciliation() {
  const [balanceBanco, setBalanceBanco] = useState(75000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceBanco(Number(e.target.value));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Conciliación Bancaria</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm">Balance en Banco</label>
          <input
            type="number"
            value={balanceBanco}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p className="text-sm">Saldo según conciliación (simulado):</p>
          <p className="text-xl font-bold text-blue-800">
            ${(balanceBanco - 2200).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
