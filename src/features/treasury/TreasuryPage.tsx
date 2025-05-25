import { useState, useMemo } from "react";
import { useAuth } from "../../stores/authStore";

// Types for Treasury Management
interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: "corriente" | "ahorro" | "inversion";
  balance: number;
  currency: "DOP" | "USD";
  status: "activa" | "inactiva" | "bloqueada";
  lastTransaction: string;
}

interface BankOperation {
  id: string;
  date: string;
  type: "ingreso" | "egreso" | "transferencia";
  accountId: string;
  amount: number;
  beneficiary: string;
  concept: string;
  reference: string;
  status: "pendiente" | "completado" | "cancelado";
  createdBy: string;
}

interface CashFlowEntry {
  id: string;
  date: string;
  type: "ingreso" | "egreso";
  amount: number;
  concept: string;
  category: string;
  accountId: string;
  status: "confirmado" | "pendiente";
}

// Mock data for demonstration
const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "Banco Popular Dominicano",
    accountNumber: "898-3100000001-0-00",
    accountType: "corriente",
    balance: 2500000,
    currency: "DOP",
    status: "activa",
    lastTransaction: "2024-02-15T14:30:00Z",
  },
  {
    id: "2",
    bankName: "Banco de Reservas",
    accountNumber: "910-7890123-4-56",
    accountType: "ahorro",
    balance: 850000,
    currency: "DOP",
    status: "activa",
    lastTransaction: "2024-02-14T10:15:00Z",
  },
  {
    id: "3",
    bankName: "BBVA República Dominicana",
    accountNumber: "0011-0134-0101234567",
    accountType: "ahorro",
    balance: 15000,
    currency: "USD",
    status: "activa",
    lastTransaction: "2024-02-13T16:45:00Z",
  },
];

const mockBankOperations: BankOperation[] = [
  {
    id: "1",
    date: "2024-02-15",
    type: "ingreso",
    accountId: "1",
    amount: 150000,
    beneficiary: "Empresa XYZ S.R.L.",
    concept: "Pago de factura #INV-2024-001",
    reference: "TRF-001",
    status: "completado",
    createdBy: "María Rodríguez",
  },
  {
    id: "2",
    date: "2024-02-15",
    type: "egreso",
    accountId: "2",
    amount: 85000,
    beneficiary: "Proveedores Unidos",
    concept: "Pago de suministros de oficina",
    reference: "TRF-002",
    status: "pendiente",
    createdBy: "Carlos Martínez",
  },
  {
    id: "3",
    date: "2024-02-14",
    type: "transferencia",
    accountId: "1",
    amount: 200000,
    beneficiary: "Cuenta Banco de Reservas",
    concept: "Transferencia entre cuentas propias",
    reference: "TRF-003",
    status: "completado",
    createdBy: "Ana García",
  },
];

const mockCashFlow: CashFlowEntry[] = [
  {
    id: "1",
    date: "2024-02-15",
    type: "ingreso",
    amount: 150000,
    concept: "Pago de cliente ABC",
    category: "Ventas",
    accountId: "1",
    status: "confirmado",
  },
  {
    id: "2",
    date: "2024-02-14",
    type: "egreso",
    amount: 45000,
    concept: "Pago de electricidad",
    category: "Servicios Públicos",
    accountId: "2",
    status: "confirmado",
  },
  {
    id: "3",
    date: "2024-02-13",
    type: "egreso",
    amount: 125000,
    concept: "Pago de salarios",
    category: "Nómina",
    accountId: "1",
    status: "confirmado",
  },
];

export default function TreasuryPage() {
  const {
    /* user */
  } = useAuth();
  const [bankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [bankOperations] = useState<BankOperation[]>(mockBankOperations);
  const [cashFlow] = useState<CashFlowEntry[]>(mockCashFlow);
  const [activeTab, setActiveTab] = useState<
    "accounts" | "operations" | "cashflow" | "reconciliation"
  >("accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showOperationForm, setShowOperationForm] = useState(false);

  // Calculate KPIs
  const totalBalance = bankAccounts
    .filter((acc) => acc.currency === "DOP")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalBalanceUSD = bankAccounts
    .filter((acc) => acc.currency === "USD")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const pendingOperations = bankOperations.filter(
    (op) => op.status === "pendiente"
  ).length;

  const activeAccounts = bankAccounts.filter(
    (acc) => acc.status === "activa"
  ).length;

  // Filter bank operations
  const filteredOperations = useMemo(() => {
    return bankOperations.filter((operation) => {
      // const account = bankAccounts.find(
      //   (acc) => acc.id === operation.accountId
      // );
      const matchesSearch =
        operation.beneficiary
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        operation.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        operation.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || operation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bankOperations, bankAccounts, searchTerm, statusFilter]);

  const formatCurrency = (amount: number, currency: string = "DOP") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    }
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completado":
      case "confirmado":
      case "activa":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "pendiente":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "cancelado":
      case "inactiva":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "bloqueada":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case "ingreso":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "egreso":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "transferencia":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const typeMap = {
      corriente: "Corriente",
      ahorro: "Ahorro",
      inversion: "Inversión",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Módulo de Tesorería
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona cuentas bancarias, operaciones financieras y flujo de
                efectivo
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowAccountForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Nueva Cuenta
              </button>
              <button
                onClick={() => setShowOperationForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 text-sm font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h5a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1h5z"
                  />
                </svg>
                Nueva Operación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saldo Total (DOP)
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Saldo Total (USD)
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalBalanceUSD, "USD")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Operaciones Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pendingOperations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cuentas Activas
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {activeAccounts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("accounts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "accounts"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Cuentas Bancarias
              </button>
              <button
                onClick={() => setActiveTab("operations")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "operations"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Operaciones Bancarias
              </button>
              <button
                onClick={() => setActiveTab("cashflow")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "cashflow"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Flujo de Efectivo
              </button>
              <button
                onClick={() => setActiveTab("reconciliation")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reconciliation"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Conciliación Bancaria
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Cuentas Bancarias Tab */}
            {activeTab === "accounts" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Cuentas Bancarias
                  </h3>
                  <button
                    onClick={() => setShowAccountForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 text-sm font-medium"
                  >
                    Nueva Cuenta
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Banco
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Número de Cuenta
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Saldo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {bankAccounts.map((account) => (
                          <tr
                            key={account.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {account.bankName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Última transacción:{" "}
                                  {formatDate(account.lastTransaction)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {account.accountNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                {getAccountTypeLabel(account.accountType)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {formatCurrency(
                                account.balance,
                                account.currency
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(account.status)}`}
                              >
                                {account.status.charAt(0).toUpperCase() +
                                  account.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                  Ver
                                </button>
                                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                  Editar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Operaciones Bancarias Tab */}
            {activeTab === "operations" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buscar Operación
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Beneficiario, concepto o referencia..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="h-5 w-5 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="completado">Completado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowOperationForm(true)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:hover:bg-green-600 text-sm font-medium"
                    >
                      Nueva Operación
                    </button>
                  </div>
                </div>

                {/* Operations Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Beneficiario
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Concepto
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredOperations.map((operation) => {
                          const account = bankAccounts.find(
                            (acc) => acc.id === operation.accountId
                          );
                          return (
                            <tr
                              key={operation.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(operation.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getOperationTypeColor(operation.type)}`}
                                >
                                  {operation.type.charAt(0).toUpperCase() +
                                    operation.type.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {operation.beneficiary}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Ref: {operation.reference}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {operation.concept}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                                {formatCurrency(
                                  operation.amount,
                                  account?.currency
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(operation.status)}`}
                                >
                                  {operation.status.charAt(0).toUpperCase() +
                                    operation.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-2">
                                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                    Ver
                                  </button>
                                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                    Editar
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Flujo de Efectivo Tab */}
            {activeTab === "cashflow" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Flujo de Efectivo
                  </h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 text-sm font-medium">
                    Generar Reporte
                  </button>
                </div>

                {/* Cash Flow Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-6 border border-green-200 dark:border-green-800">
                    <h4 className="text-lg font-medium text-green-900 dark:text-green-300 mb-2">
                      Ingresos del Mes
                    </h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(
                        cashFlow
                          .filter((entry) => entry.type === "ingreso")
                          .reduce((sum, entry) => sum + entry.amount, 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-6 border border-red-200 dark:border-red-800">
                    <h4 className="text-lg font-medium text-red-900 dark:text-red-300 mb-2">
                      Egresos del Mes
                    </h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(
                        cashFlow
                          .filter((entry) => entry.type === "egreso")
                          .reduce((sum, entry) => sum + entry.amount, 0)
                      )}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">
                      Flujo Neto
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(
                        cashFlow.reduce(
                          (sum, entry) =>
                            entry.type === "ingreso"
                              ? sum + entry.amount
                              : sum - entry.amount,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>

                {/* Cash Flow Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Concepto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {cashFlow.map((entry) => {
                          const account = bankAccounts.find(
                            (acc) => acc.id === entry.accountId
                          );
                          return (
                            <tr
                              key={entry.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {formatDate(entry.date)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getOperationTypeColor(entry.type)}`}
                                >
                                  {entry.type.charAt(0).toUpperCase() +
                                    entry.type.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {entry.concept}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                {entry.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                                {formatCurrency(
                                  entry.amount,
                                  account?.currency
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.status)}`}
                                >
                                  {entry.status.charAt(0).toUpperCase() +
                                    entry.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Conciliación Bancaria Tab */}
            {activeTab === "reconciliation" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Conciliación Bancaria
                  </h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 text-sm font-medium">
                    Nueva Conciliación
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Banco Popular Dominicano
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Cuenta: 898-3100000001-0-00
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Última conciliación: 15/02/2024
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Conciliar →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Banco de Reservas
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Cuenta: 910-7890123-4-56
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Última conciliación: 10/02/2024
                    </p>
                    <button className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 text-sm font-medium">
                      Pendiente →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      BBVA República Dominicana
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Cuenta: 0011-0134-0101234567
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Última conciliación: 12/02/2024
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Conciliar →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAccountForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nueva Cuenta Bancaria
            </h3>
            <p className="text-gray-600 mb-6">
              El formulario para registrar nuevas cuentas bancarias estará
              disponible próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAccountForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showOperationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nueva Operación Bancaria
            </h3>
            <p className="text-gray-600 mb-6">
              El formulario para registrar nuevas operaciones bancarias estará
              disponible próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowOperationForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
