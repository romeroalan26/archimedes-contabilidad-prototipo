import { useState, /* useEffect, */ useMemo } from "react";
import { useAuth } from "../../stores/authStore";

// Types for Asset Management
interface Asset {
  id: string;
  name: string;
  category: string;
  description: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  depreciationRate: number;
  status: "active" | "maintenance" | "sold" | "retired";
  location: string;
  serialNumber: string;
  supplier: string;
  usefulLife: number; // in years
  accumulatedDepreciation: number;
}

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Computadora Dell Optiplex",
    category: "Equipo de Cómputo",
    description: "Computadora de escritorio para contabilidad",
    acquisitionDate: "2022-01-15",
    acquisitionCost: 35000,
    currentValue: 25000,
    depreciationRate: 20,
    status: "active",
    location: "Oficina Principal - Piso 2",
    serialNumber: "DL-2022-001",
    supplier: "Tecnología Total S.R.L.",
    usefulLife: 5,
    accumulatedDepreciation: 10000,
  },
  {
    id: "2",
    name: "Aire Acondicionado LG 24000 BTU",
    category: "Equipos de Climatización",
    description: "Sistema de climatización sala principal",
    acquisitionDate: "2021-06-10",
    acquisitionCost: 45000,
    currentValue: 30000,
    depreciationRate: 10,
    status: "active",
    location: "Sala Principal",
    serialNumber: "LG-AC-2021-003",
    supplier: "Clima Solutions",
    usefulLife: 10,
    accumulatedDepreciation: 15000,
  },
  {
    id: "3",
    name: "Escritorio Ejecutivo de Madera",
    category: "Mobiliario de Oficina",
    description: "Escritorio ejecutivo con cajones",
    acquisitionDate: "2020-03-20",
    acquisitionCost: 18000,
    currentValue: 12000,
    depreciationRate: 10,
    status: "active",
    location: "Oficina Gerencia",
    serialNumber: "MOB-2020-015",
    supplier: "Muebles y Más",
    usefulLife: 10,
    accumulatedDepreciation: 6000,
  },
  {
    id: "4",
    name: "Vehículo Toyota Corolla",
    category: "Vehículos",
    description: "Vehículo para uso comercial",
    acquisitionDate: "2019-11-05",
    acquisitionCost: 850000,
    currentValue: 550000,
    depreciationRate: 20,
    status: "maintenance",
    location: "Parqueo Principal",
    serialNumber: "TOY-2019-COR",
    supplier: "Toyota Dominicana",
    usefulLife: 5,
    accumulatedDepreciation: 300000,
  },
];

export default function AssetsPage() {
  const {
    /* user */
  } = useAuth();
  const [assets] = useState<Asset[]>(mockAssets);
  const [activeTab, setActiveTab] = useState<
    "list" | "depreciation" | "reports"
  >("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAssetForm, setShowAssetForm] = useState(false);

  // Calculate KPIs
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalAcquisitionCost = assets.reduce(
    (sum, asset) => sum + asset.acquisitionCost,
    0
  );
  const totalDepreciation = assets.reduce(
    (sum, asset) => sum + asset.accumulatedDepreciation,
    0
  );
  const assetsInMaintenance = assets.filter(
    (asset) => asset.status === "maintenance"
  ).length;

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(assets.map((asset) => asset.category)),
    ];
    return uniqueCategories;
  }, [assets]);

  // Filter assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchTerm, categoryFilter, statusFilter]);

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
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "maintenance":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "sold":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "retired":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "maintenance":
        return "Mantenimiento";
      case "sold":
        return "Vendido";
      case "retired":
        return "Dado de Baja";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Activos Fijos
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona y controla todos los activos fijos de tu empresa
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowAssetForm(true)}
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nuevo Activo
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Activos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalAssets}
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Valor Actual
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalValue)}
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Depreciación Acum.
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalDepreciation)}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  En Mantenimiento
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {assetsInMaintenance}
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
                onClick={() => setActiveTab("list")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Lista de Activos
              </button>
              <button
                onClick={() => setActiveTab("depreciation")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "depreciation"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Depreciación
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Reportes
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Lista de Activos Tab */}
            {activeTab === "list" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buscar Activo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nombre, serie o ubicación..."
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
                      Categoría
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    >
                      <option value="all">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
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
                      <option value="active">Activo</option>
                      <option value="maintenance">Mantenimiento</option>
                      <option value="sold">Vendido</option>
                      <option value="retired">Dado de Baja</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => setShowAssetForm(true)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm font-medium"
                    >
                      Nuevo Activo
                    </button>
                  </div>
                </div>

                {/* Assets Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Activo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            F. Adquisición
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Valor Actual
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Ubicación
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAssets.map((asset) => (
                          <tr
                            key={asset.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {asset.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Serie: {asset.serialNumber}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                {asset.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDate(asset.acquisitionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrency(asset.currentValue)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Costo: {formatCurrency(asset.acquisitionCost)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(asset.status)}`}
                              >
                                {getStatusLabel(asset.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                              {asset.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                                  Ver
                                </button>
                                <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                                  Editar
                                </button>
                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                  Eliminar
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

            {/* Depreciación Tab */}
            {activeTab === "depreciation" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Cálculo de Depreciación
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Esta sección muestra el cálculo de depreciación de todos los
                    activos fijos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Depreciación Anual
                      </h4>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(totalDepreciation / 3)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Promedio estimado
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Depreciación Mensual
                      </h4>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(totalDepreciation / 36)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Promedio estimado
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        Valor Depreciable
                      </h4>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(totalAcquisitionCost - totalValue)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total depreciado
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reportes Tab */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Reportes de Activos Fijos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Inventario de Activos
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Listado completo de todos los activos fijos
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Depreciación por Período
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Cálculo de depreciación mensual y anual
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Activos por Categoría
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Distribución de activos por categorías
                    </p>
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium">
                      Generar Reporte →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal placeholder para nuevo activo */}
      {showAssetForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Nuevo Activo Fijo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El formulario para registrar nuevos activos estará disponible
              próximamente.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAssetForm(false)}
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
