import { useState, useMemo } from "react";
import { useAuth } from "../../stores/authStore";

// Types for Accounting Management
interface Account {
  id: string;
  code: string;
  name: string;
  type: "assets" | "liabilities" | "equity" | "revenue" | "expenses";
  category: string;
  balance: number;
  isActive: boolean;
  description: string;
}

interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  entries: {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  status: "draft" | "posted" | "reversed";
  createdBy: string;
  createdAt: string;
}

// Mock data for demonstration
const mockAccounts: Account[] = [
  {
    id: "1",
    code: "1100",
    name: "Efectivo en Caja",
    type: "assets",
    category: "Activo Corriente",
    balance: 150000,
    isActive: true,
    description: "Dinero en efectivo disponible en caja",
  },
  {
    id: "2",
    code: "1200",
    name: "Bancos",
    type: "assets",
    category: "Activo Corriente",
    balance: 850000,
    isActive: true,
    description: "Depósitos en cuentas bancarias",
  },
  {
    id: "3",
    code: "1300",
    name: "Cuentas por Cobrar",
    type: "assets",
    category: "Activo Corriente",
    balance: 320000,
    isActive: true,
    description: "Facturas pendientes de cobro a clientes",
  },
  {
    id: "4",
    code: "2100",
    name: "Cuentas por Pagar",
    type: "liabilities",
    category: "Pasivo Corriente",
    balance: 180000,
    isActive: true,
    description: "Facturas pendientes de pago a proveedores",
  },
  {
    id: "5",
    code: "3100",
    name: "Capital Social",
    type: "equity",
    category: "Patrimonio",
    balance: 500000,
    isActive: true,
    description: "Capital aportado por los socios",
  },
  {
    id: "6",
    code: "4100",
    name: "Ingresos por Ventas",
    type: "revenue",
    category: "Ingresos",
    balance: 1200000,
    isActive: true,
    description: "Ingresos generados por ventas de productos/servicios",
  },
];

const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-02-15",
    reference: "JE-001",
    description: "Venta de productos al contado",
    entries: [
      {
        accountId: "1",
        accountName: "Efectivo en Caja",
        debit: 50000,
        credit: 0,
      },
      {
        accountId: "6",
        accountName: "Ingresos por Ventas",
        debit: 0,
        credit: 50000,
      },
    ],
    status: "posted",
    createdBy: "María Rodríguez",
    createdAt: "2024-02-15T10:30:00Z",
  },
];

export default function AccountingPage() {
  const {
    /* user */
  } = useAuth();
  const [accounts] = useState<Account[]>(mockAccounts);
  const [journalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [activeTab, setActiveTab] = useState<
    "accounts" | "journal" | "reports"
  >("accounts");
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);

  // Calculate KPIs
  const totalAssets = accounts
    .filter((acc) => acc.type === "assets")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = accounts
    .filter((acc) => acc.type === "liabilities")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalEquity = accounts
    .filter((acc) => acc.type === "equity")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalRevenue = accounts
    .filter((acc) => acc.type === "revenue")
    .reduce((sum, acc) => sum + acc.balance, 0);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.code.includes(searchTerm);
      const matchesType =
        accountTypeFilter === "all" || account.type === accountTypeFilter;

      return matchesSearch && matchesType && account.isActive;
    });
  }, [accounts, searchTerm, accountTypeFilter]);

  const formatCurrency = (amount: number) => {
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

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "assets":
        return "bg-green-100 text-green-800";
      case "liabilities":
        return "bg-red-100 text-red-800";
      case "equity":
        return "bg-blue-100 text-blue-800";
      case "revenue":
        return "bg-purple-100 text-purple-800";
      case "expenses":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAccountTypeLabel = (type: string) => {
    const typeMap = {
      assets: "Activo",
      liabilities: "Pasivo",
      equity: "Patrimonio",
      revenue: "Ingreso",
      expenses: "Gasto",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Módulo de Contabilidad
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona el plan de cuentas, asientos contables y reportes
                financieros
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowAccountForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium flex items-center"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nueva Cuenta
              </button>
              <button
                onClick={() => setShowJournalForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Nuevo Asiento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
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
                <p className="text-sm font-medium text-gray-600">
                  Total Activos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalAssets)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Pasivos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalLiabilities)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patrimonio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalEquity)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("accounts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "accounts"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Plan de Cuentas
              </button>
              <button
                onClick={() => setActiveTab("journal")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "journal"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Libro Diario
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reportes Financieros
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Plan de Cuentas Tab */}
            {activeTab === "accounts" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buscar Cuenta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Código o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                          className="h-5 w-5 text-gray-400"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Cuenta
                    </label>
                    <select
                      value={accountTypeFilter}
                      onChange={(e) => setAccountTypeFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="assets">Activos</option>
                      <option value="liabilities">Pasivos</option>
                      <option value="equity">Patrimonio</option>
                      <option value="revenue">Ingresos</option>
                      <option value="expenses">Gastos</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowAccountForm(true)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                    >
                      Nueva Cuenta
                    </button>
                  </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Código
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre de la Cuenta
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Saldo
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAccounts.map((account) => (
                          <tr
                            key={account.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {account.code}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {account.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {account.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getAccountTypeColor(account.type)}`}
                              >
                                {getAccountTypeLabel(account.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(account.balance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  Ver
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
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

            {/* Libro Diario Tab */}
            {activeTab === "journal" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Asientos del Libro Diario
                  </h3>
                  <button
                    onClick={() => setShowJournalForm(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    Nuevo Asiento
                  </button>
                </div>

                <div className="space-y-4">
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {entry.reference}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {entry.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Fecha: {formatDate(entry.date)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                            Ver
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 text-sm">
                            Editar
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">
                                Cuenta
                              </th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">
                                Debe
                              </th>
                              <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">
                                Haber
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {entry.entries.map((line, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-100"
                              >
                                <td className="py-2 text-sm text-gray-900">
                                  {line.accountName}
                                </td>
                                <td className="py-2 text-sm text-gray-900 text-right">
                                  {line.debit > 0
                                    ? formatCurrency(line.debit)
                                    : "-"}
                                </td>
                                <td className="py-2 text-sm text-gray-900 text-right">
                                  {line.credit > 0
                                    ? formatCurrency(line.credit)
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reportes Financieros Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Reportes Financieros
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Balance General
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Estado de situación financiera
                    </p>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Estado de Resultados
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Ingresos y gastos del período
                    </p>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Balance de Comprobación
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Saldos de todas las cuentas
                    </p>
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      Generar Reporte →
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
              Nueva Cuenta Contable
            </h3>
            <p className="text-gray-600 mb-6">
              El formulario para crear nuevas cuentas contables estará
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

      {showJournalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nuevo Asiento Contable
            </h3>
            <p className="text-gray-600 mb-6">
              El formulario para crear nuevos asientos contables estará
              disponible próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowJournalForm(false)}
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
