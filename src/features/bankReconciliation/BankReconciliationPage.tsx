import { useState, useEffect } from "react";

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  reference: string;
  reconciled: boolean;
}

interface SystemTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  reconciled: boolean;
}

const mockBankTransactions: BankTransaction[] = [
  {
    id: "bank-1",
    date: "2024-01-15",
    description: "Transferencia recibida - Cliente ABC Corp",
    amount: 125000.0,
    type: "credit",
    reference: "TRF-2024-001",
    reconciled: false,
  },
  {
    id: "bank-2",
    date: "2024-01-14",
    description: "Pago proveedor - Suministros XYZ",
    amount: 45000.0,
    type: "debit",
    reference: "CHK-2024-005",
    reconciled: false,
  },
  {
    id: "bank-3",
    date: "2024-01-14",
    description: "Comisión bancaria",
    amount: 850.0,
    type: "debit",
    reference: "FEE-2024-001",
    reconciled: false,
  },
  {
    id: "bank-4",
    date: "2024-01-13",
    description: "Depósito en efectivo",
    amount: 75000.0,
    type: "credit",
    reference: "DEP-2024-003",
    reconciled: true,
  },
];

const mockSystemTransactions: SystemTransaction[] = [
  {
    id: "sys-1",
    date: "2024-01-15",
    description: "Venta - Factura #001234",
    amount: 125000.0,
    type: "credit",
    category: "Ventas",
    reconciled: false,
  },
  {
    id: "sys-2",
    date: "2024-01-14",
    description: "Compra - Orden #5678",
    amount: 45000.0,
    type: "debit",
    category: "Compras",
    reconciled: false,
  },
  {
    id: "sys-3",
    date: "2024-01-13",
    description: "Venta en efectivo #001235",
    amount: 75000.0,
    type: "credit",
    category: "Ventas",
    reconciled: true,
  },
];

export default function BankReconciliationPage() {
  const [selectedAccount, setSelectedAccount] = useState("cuenta-principal");
  const [reconciliationPeriod, setReconciliationPeriod] = useState({
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  });
  const [bankTransactions, setBankTransactions] =
    useState(mockBankTransactions);
  const [systemTransactions, setSystemTransactions] = useState(
    mockSystemTransactions
  );
  const [selectedBankItems, setSelectedBankItems] = useState<string[]>([]);
  const [selectedSystemItems, setSelectedSystemItems] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calcular estadísticas
  const bankBalance = bankTransactions.reduce((acc, transaction) => {
    return (
      acc +
      (transaction.type === "credit" ? transaction.amount : -transaction.amount)
    );
  }, 0);

  const systemBalance = systemTransactions.reduce((acc, transaction) => {
    return (
      acc +
      (transaction.type === "credit" ? transaction.amount : -transaction.amount)
    );
  }, 0);

  const difference = bankBalance - systemBalance;
  const reconciledCount = bankTransactions.filter((t) => t.reconciled).length;
  const totalTransactions = bankTransactions.length;

  const handleReconcileItems = () => {
    // Reconciliar items seleccionados
    setBankTransactions((prev) =>
      prev.map((transaction) =>
        selectedBankItems.includes(transaction.id)
          ? { ...transaction, reconciled: true }
          : transaction
      )
    );

    setSystemTransactions((prev) =>
      prev.map((transaction) =>
        selectedSystemItems.includes(transaction.id)
          ? { ...transaction, reconciled: true }
          : transaction
      )
    );

    setSelectedBankItems([]);
    setSelectedSystemItems([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Conciliación Bancaria
              </h1>
              <p className="mt-2 text-gray-600">
                Concilie las transacciones bancarias con los registros del
                sistema
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="text-sm font-medium text-gray-900">
                {currentTime.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de periodo y cuenta */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configuración de Conciliación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuenta Bancaria
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <option value="cuenta-principal">
                  Cuenta Principal - ****1234
                </option>
                <option value="cuenta-nomina">Cuenta Nómina - ****5678</option>
                <option value="cuenta-ahorros">
                  Cuenta Ahorros - ****9012
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={reconciliationPeriod.startDate}
                onChange={(e) =>
                  setReconciliationPeriod((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={reconciliationPeriod.endDate}
                onChange={(e) =>
                  setReconciliationPeriod((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas de conciliación */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Saldo Bancario
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(bankBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Saldo Sistema
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(systemBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 ${difference === 0 ? "bg-green-100" : "bg-yellow-100"} rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className={`w-5 h-5 ${difference === 0 ? "text-green-600" : "text-yellow-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Diferencia</p>
                <p
                  className={`text-2xl font-bold ${difference === 0 ? "text-green-600" : "text-yellow-600"}`}
                >
                  {formatCurrency(Math.abs(difference))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reconciledCount}/{totalTransactions}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(reconciledCount / totalTransactions) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button
              onClick={handleReconcileItems}
              disabled={
                selectedBankItems.length === 0 &&
                selectedSystemItems.length === 0
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Conciliar Seleccionados
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Importar Extracto
            </button>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
            Generar Reporte
          </button>
        </div>

        {/* Tablas de transacciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transacciones Bancarias */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Transacciones Bancarias
              </h3>
              <p className="text-sm text-gray-500">
                Seleccione las transacciones del banco
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBankItems(
                              bankTransactions
                                .filter((t) => !t.reconciled)
                                .map((t) => t.id)
                            );
                          } else {
                            setSelectedBankItems([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bankTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={transaction.reconciled ? "bg-green-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBankItems.includes(transaction.id)}
                          disabled={transaction.reconciled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBankItems((prev) => [
                                ...prev,
                                transaction.id,
                              ]);
                            } else {
                              setSelectedBankItems((prev) =>
                                prev.filter((id) => id !== transaction.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div
                          className="max-w-xs truncate"
                          title={transaction.description}
                        >
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ref: {transaction.reference}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.reconciled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Conciliado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transacciones del Sistema */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Registros del Sistema
              </h3>
              <p className="text-sm text-gray-500">
                Seleccione las transacciones del sistema
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSystemItems(
                              systemTransactions
                                .filter((t) => !t.reconciled)
                                .map((t) => t.id)
                            );
                          } else {
                            setSelectedSystemItems([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {systemTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className={transaction.reconciled ? "bg-green-50" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSystemItems.includes(transaction.id)}
                          disabled={transaction.reconciled}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSystemItems((prev) => [
                                ...prev,
                                transaction.id,
                              ]);
                            } else {
                              setSelectedSystemItems((prev) =>
                                prev.filter((id) => id !== transaction.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div
                          className="max-w-xs truncate"
                          title={transaction.description}
                        >
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          Categoría: {transaction.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.reconciled ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Conciliado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
