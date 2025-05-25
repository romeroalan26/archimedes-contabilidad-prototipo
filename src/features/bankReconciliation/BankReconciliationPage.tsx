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
  const [activeTab, setActiveTab] = useState<"bank" | "system" | "comparison">(
    "comparison"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "reconciled" | "pending"
  >("all");

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

  // Filtrar transacciones
  const filterTransactions = (transactions: any[]) => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.reference
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "reconciled" && transaction.reconciled) ||
        (statusFilter === "pending" && !transaction.reconciled);

      return matchesSearch && matchesStatus;
    });
  };

  const filteredBankTransactions = filterTransactions(bankTransactions);
  const filteredSystemTransactions = filterTransactions(systemTransactions);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Conciliación Bancaria
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Concilie las transacciones bancarias con los registros del
                sistema
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                Importar Extracto
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Configuración de periodo y cuenta */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Configuración de Conciliación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cuenta Bancaria
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas de conciliación */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saldo Bancario
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(bankBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-400"
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saldo Sistema
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(systemBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 ${difference === 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"} rounded-lg flex items-center justify-center`}
                >
                  <svg
                    className={`w-5 h-5 ${difference === 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Diferencia
                </p>
                <p
                  className={`text-2xl font-bold ${difference === 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}
                >
                  {formatCurrency(Math.abs(difference))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Progreso
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {reconciledCount}/{totalTransactions}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(reconciledCount / totalTransactions) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por descripción, referencia o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "reconciled" | "pending"
                )
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="reconciled">Conciliadas</option>
            </select>
            <button
              onClick={handleReconcileItems}
              disabled={
                selectedBankItems.length === 0 &&
                selectedSystemItems.length === 0
              }
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              Conciliar ({selectedBankItems.length + selectedSystemItems.length}
              )
            </button>
          </div>
        </div>

        {/* Navegación por tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("comparison")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "comparison"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Vista Comparativa
              </button>
              <button
                onClick={() => setActiveTab("bank")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "bank"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Transacciones Bancarias ({filteredBankTransactions.length})
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "system"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Registros del Sistema ({filteredSystemTransactions.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Vista Comparativa */}
            {activeTab === "comparison" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Transacciones Bancarias - Vista Compacta */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Transacciones Bancarias
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {
                        filteredBankTransactions.filter((t) => !t.reconciled)
                          .length
                      }{" "}
                      pendientes
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredBankTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          transaction.reconciled
                            ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                            : selectedBankItems.includes(transaction.id)
                              ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-700"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedBankItems.includes(
                                transaction.id
                              )}
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
                              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {transaction.description}
                                </p>
                                <span
                                  className={`text-sm font-semibold ${
                                    transaction.type === "credit"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.type === "credit" ? "+" : "-"}
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("es-ES")}{" "}
                                  • {transaction.reference}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.reconciled
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                                  }`}
                                >
                                  {transaction.reconciled
                                    ? "Conciliado"
                                    : "Pendiente"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Registros del Sistema - Vista Compacta */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Registros del Sistema
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {
                        filteredSystemTransactions.filter((t) => !t.reconciled)
                          .length
                      }{" "}
                      pendientes
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredSystemTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          transaction.reconciled
                            ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                            : selectedSystemItems.includes(transaction.id)
                              ? "bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-700"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedSystemItems.includes(
                                transaction.id
                              )}
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
                              className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {transaction.description}
                                </p>
                                <span
                                  className={`text-sm font-semibold ${
                                    transaction.type === "credit"
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.type === "credit" ? "+" : "-"}
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("es-ES")}{" "}
                                  • {transaction.category}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.reconciled
                                      ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                      : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                                  }`}
                                >
                                  {transaction.reconciled
                                    ? "Conciliado"
                                    : "Pendiente"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Vista detallada de Transacciones Bancarias */}
            {activeTab === "bank" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBankItems(
                                filteredBankTransactions
                                  .filter((t) => !t.reconciled)
                                  .map((t) => t.id)
                              );
                            } else {
                              setSelectedBankItems([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBankTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          transaction.reconciled
                            ? "bg-green-50 dark:bg-green-900/10"
                            : ""
                        }`}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(transaction.date).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          <div className="max-w-xs">
                            {transaction.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span
                            className={
                              transaction.type === "credit"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.reconciled
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {transaction.reconciled
                              ? "Conciliado"
                              : "Pendiente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Vista detallada de Registros del Sistema */}
            {activeTab === "system" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSystemItems(
                                filteredSystemTransactions
                                  .filter((t) => !t.reconciled)
                                  .map((t) => t.id)
                              );
                            } else {
                              setSelectedSystemItems([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredSystemTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          transaction.reconciled
                            ? "bg-green-50 dark:bg-green-900/10"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedSystemItems.includes(
                              transaction.id
                            )}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {new Date(transaction.date).toLocaleDateString(
                            "es-ES"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          <div className="max-w-xs">
                            {transaction.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <span
                            className={
                              transaction.type === "credit"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.reconciled
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {transaction.reconciled
                              ? "Conciliado"
                              : "Pendiente"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
