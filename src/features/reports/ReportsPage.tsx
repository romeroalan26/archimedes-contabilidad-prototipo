import { useState, useMemo } from "react";
import { useAuth } from "../../stores/authStore";

// Types for Reports Management
interface FinancialReport {
  id: string;
  name: string;
  description: string;
  type: "balance" | "income" | "cashflow" | "trial";
  lastGenerated: string;
  status: "disponible" | "generando" | "error";
}

interface NCFEntry {
  id: string;
  type: "B01" | "B02" | "B14" | "B15";
  number: string;
  client: string;
  date: string;
  amount: number;
  itbis: number;
  total: number;
  status: "emitido" | "anulado" | "enviado";
}

interface DGIIFormat {
  id: string;
  code: "606" | "607" | "608" | "609";
  name: string;
  description: string;
  period: string;
  status: "pendiente" | "generado" | "enviado";
  lastGenerated: string;
}

interface CustomReport {
  id: string;
  name: string;
  module:
    | "ventas"
    | "compras"
    | "nomina"
    | "inventario"
    | "activos"
    | "tesoreria";
  description: string;
  type: "resumen" | "detallado" | "analisis";
  lastGenerated: string;
}

// Mock data for demonstration
const mockFinancialReports: FinancialReport[] = [
  {
    id: "1",
    name: "Balance General",
    description: "Estado de situación financiera al cierre del período",
    type: "balance",
    lastGenerated: "2024-02-15T10:30:00Z",
    status: "disponible",
  },
  {
    id: "2",
    name: "Estado de Resultados",
    description: "Ingresos y gastos del período actual",
    type: "income",
    lastGenerated: "2024-02-15T10:30:00Z",
    status: "disponible",
  },
  {
    id: "3",
    name: "Flujo de Efectivo",
    description: "Movimientos de entrada y salida de efectivo",
    type: "cashflow",
    lastGenerated: "2024-02-14T16:45:00Z",
    status: "disponible",
  },
  {
    id: "4",
    name: "Balance de Comprobación",
    description: "Saldos de todas las cuentas del plan contable",
    type: "trial",
    lastGenerated: "2024-02-13T14:20:00Z",
    status: "disponible",
  },
];

const mockNCFEntries: NCFEntry[] = [
  {
    id: "1",
    type: "B01",
    number: "B0100000001",
    client: "Consumidor Final",
    date: "2024-02-15",
    amount: 50000,
    itbis: 9000,
    total: 59000,
    status: "emitido",
  },
  {
    id: "2",
    type: "B02",
    number: "B0200000001",
    client: "Empresa ABC S.R.L.",
    date: "2024-02-15",
    amount: 120000,
    itbis: 21600,
    total: 141600,
    status: "emitido",
  },
  {
    id: "3",
    type: "B14",
    number: "B1400000001",
    client: "Ministerio de Educación",
    date: "2024-02-14",
    amount: 85000,
    itbis: 0,
    total: 85000,
    status: "enviado",
  },
];

const mockDGIIFormats: DGIIFormat[] = [
  {
    id: "1",
    code: "606",
    name: "Formato 606",
    description: "Reporte de Compras y Servicios",
    period: "Febrero 2024",
    status: "generado",
    lastGenerated: "2024-02-15T09:00:00Z",
  },
  {
    id: "2",
    code: "607",
    name: "Formato 607",
    description: "Reporte de Ventas",
    period: "Febrero 2024",
    status: "generado",
    lastGenerated: "2024-02-15T09:15:00Z",
  },
  {
    id: "3",
    code: "608",
    name: "Formato 608",
    description: "Reporte de Comprobantes Anulados",
    period: "Febrero 2024",
    status: "pendiente",
    lastGenerated: "2024-02-10T11:30:00Z",
  },
];

const mockCustomReports: CustomReport[] = [
  {
    id: "1",
    name: "Análisis de Ventas",
    module: "ventas",
    description: "Reporte detallado de ventas por cliente y período",
    type: "analisis",
    lastGenerated: "2024-02-15T11:00:00Z",
  },
  {
    id: "2",
    name: "Reporte de Nómina",
    module: "nomina",
    description: "Resumen de pagos y deducciones por empleado",
    type: "resumen",
    lastGenerated: "2024-02-15T08:30:00Z",
  },
  {
    id: "3",
    name: "Inventario por Categoría",
    module: "inventario",
    description: "Stock actual y valoración por categoría de productos",
    type: "detallado",
    lastGenerated: "2024-02-14T17:20:00Z",
  },
];

export default function ReportsPage() {
  const {
    /* user */
  } = useAuth();
  const [financialReports] = useState<FinancialReport[]>(mockFinancialReports);
  const [ncfEntries] = useState<NCFEntry[]>(mockNCFEntries);
  const [dgiiFormats] = useState<DGIIFormat[]>(mockDGIIFormats);
  const [customReports] = useState<CustomReport[]>(mockCustomReports);
  const [activeTab, setActiveTab] = useState<
    "financial" | "ncf" | "dgii" | "custom"
  >("financial");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNCFForm, setShowNCFForm] = useState(false);

  // Calculate KPIs
  const totalReports = financialReports.length + customReports.length;
  const totalNCF = ncfEntries.length;
  const pendingDGII = dgiiFormats.filter(
    (format) => format.status === "pendiente"
  ).length;
  const reportsThisMonth = [...financialReports, ...customReports].filter(
    (report) =>
      new Date(report.lastGenerated).getMonth() === new Date().getMonth()
  ).length;

  // Filter functions
  const filteredNCF = useMemo(() => {
    return ncfEntries.filter((ncf) => {
      const matchesSearch =
        ncf.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ncf.number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || ncf.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ncfEntries, searchTerm, statusFilter]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible":
      case "emitido":
      case "generado":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "pendiente":
      case "generando":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "anulado":
      case "error":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "enviado":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getNCFTypeLabel = (type: string) => {
    const typeMap = {
      B01: "B01 - Consumidor Final",
      B02: "B02 - Crédito Fiscal",
      B14: "B14 - Gubernamental",
      B15: "B15 - Régimen Especial",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getModuleLabel = (module: string) => {
    const moduleMap = {
      ventas: "Ventas",
      compras: "Compras",
      nomina: "Nómina",
      inventario: "Inventario",
      activos: "Activos Fijos",
      tesoreria: "Tesorería",
    };
    return moduleMap[module as keyof typeof moduleMap] || module;
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Centro de Reportes
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Genera reportes financieros, NCF, formatos DGII y análisis
                personalizados
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowNCFForm(true)}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Nuevo NCF
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200 text-sm font-medium flex items-center">
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar Reportes
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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Reportes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalReports}
                </p>
              </div>
            </div>
          </div>

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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  NCF Emitidos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalNCF}
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
                  DGII Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pendingDGII}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h8m-8 0l6 8m-6-8l6-8"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reportes del Mes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {reportsThisMonth}
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
                onClick={() => setActiveTab("financial")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "financial"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Reportes Financieros
              </button>
              <button
                onClick={() => setActiveTab("ncf")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ncf"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                NCF
              </button>
              <button
                onClick={() => setActiveTab("dgii")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dgii"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Formatos DGII
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "custom"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Reportes Personalizados
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Reportes Financieros Tab */}
            {activeTab === "financial" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Reportes Financieros
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium">
                    Generar Reporte Personalizado
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {financialReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {report.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {report.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Último: {formatDate(report.lastGenerated)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                          Generar
                        </button>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                          Descargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NCF Tab */}
            {activeTab === "ncf" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buscar NCF
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Cliente o número..."
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
                      <option value="emitido">Emitido</option>
                      <option value="anulado">Anulado</option>
                      <option value="enviado">Enviado</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowNCFForm(true)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium"
                    >
                      Nuevo NCF
                    </button>
                  </div>
                </div>

                {/* NCF Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Número
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total
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
                        {filteredNCF.map((ncf) => (
                          <tr
                            key={ncf.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                {getNCFTypeLabel(ncf.type)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              {ncf.number}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {ncf.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(ncf.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 text-right">
                              {formatCurrency(ncf.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ncf.status)}`}
                              >
                                {ncf.status.charAt(0).toUpperCase() +
                                  ncf.status.slice(1)}
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

            {/* Formatos DGII Tab */}
            {activeTab === "dgii" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Formatos DGII
                  </h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium">
                    Generar Todos los Formatos
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dgiiFormats.map((format) => (
                    <div
                      key={format.id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {format.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {format.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Período: {format.period}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Último: {formatDate(format.lastGenerated)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(format.status)}`}
                        >
                          {format.status.charAt(0).toUpperCase() +
                            format.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400">
                          Generar
                        </button>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                          Descargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
                  <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-3">
                    Acciones Rápidas DGII
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 px-4 py-3 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/30 text-sm font-medium">
                      Validar Formatos
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 px-4 py-3 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/30 text-sm font-medium">
                      Envío Automático
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 px-4 py-3 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/30 text-sm font-medium">
                      Historial de Envíos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reportes Personalizados Tab */}
            {activeTab === "custom" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Reportes por Módulo
                  </h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium">
                    Crear Reporte Personalizado
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 mr-2">
                              {getModuleLabel(report.module)}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {report.type}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {report.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {report.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Último: {formatDate(report.lastGenerated)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400">
                          Generar
                        </button>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                          Programar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Module Quick Access */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-3">
                    Acceso Rápido por Módulo
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      "ventas",
                      "compras",
                      "nomina",
                      "inventario",
                      "activos",
                      "tesoreria",
                    ].map((module) => (
                      <button
                        key={module}
                        className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 text-sm font-medium text-center"
                      >
                        {getModuleLabel(module)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NCF Modal */}
      {showNCFForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Nuevo Comprobante Fiscal
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El formulario para generar nuevos NCF estará disponible
              próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNCFForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600"
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
