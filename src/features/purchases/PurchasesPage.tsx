import { useState, useEffect } from "react";
import { useAuth } from "../../stores/authStore";

// Types based on actual API responses
interface Supplier {
  proveedor_id: string;
  nombre: string;
  rnc_cedula: string;
  telefono: string;
  correo: string;
  direccion: string;
  empresa_id: string;
  activo: boolean;
}

interface SuppliersResponse {
  proveedores: Supplier[];
  total: number;
  incluirInactivos: boolean;
}

interface PurchaseDetail {
  detalle_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  descripcion: string;
}

interface Purchase {
  factura_compra_id: string;
  proveedor_id: string;
  empresa_id: string;
  ncf_id: string | null;
  fecha: string;
  total: string;
  estado: "pendiente" | "pagada" | "parcial" | "cancelada";
  detalle: PurchaseDetail[];
}

interface PurchasesResponse {
  facturas: Purchase[];
  total: number;
}

// API Services
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.sistemacontable.lat/api";

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

const suppliersService = {
  getAll: async (
    token: string,
    incluirInactivos = false
  ): Promise<SuppliersResponse> => {
    const url = `${API_BASE_URL}/proveedores${incluirInactivos ? "?incluir_inactivos=true" : ""}`;
    const response = await fetch(url, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error("Error fetching suppliers");
    return response.json();
  },

  create: async (
    token: string,
    supplier: Omit<Supplier, "proveedor_id" | "activo">
  ): Promise<Supplier> => {
    const response = await fetch(`${API_BASE_URL}/proveedores`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error("Error creating supplier");
    return response.json();
  },

  update: async (
    token: string,
    id: string,
    supplier: Partial<Supplier>
  ): Promise<Supplier> => {
    const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(supplier),
    });
    if (!response.ok) throw new Error("Error updating supplier");
    return response.json();
  },

  delete: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error("Error deleting supplier");
  },
};

const purchasesService = {
  getAll: async (token: string): Promise<PurchasesResponse> => {
    const response = await fetch(`${API_BASE_URL}/compras/facturas`, {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error("Error fetching purchases");
    return response.json();
  },

  create: async (token: string, purchase: any): Promise<Purchase> => {
    const response = await fetch(`${API_BASE_URL}/compras/facturas`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(purchase),
    });
    if (!response.ok) throw new Error("Error creating purchase");
    return response.json();
  },

  update: async (
    token: string,
    id: string,
    purchase: any
  ): Promise<Purchase> => {
    const response = await fetch(`${API_BASE_URL}/compras/facturas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(purchase),
    });
    if (!response.ok) throw new Error("Error updating purchase");
    return response.json();
  },

  delete: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/compras/facturas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error("Error deleting purchase");
  },
};

export default function PurchasesPage() {
  const { /* user, */ token } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"list" | "new" | "suppliers">(
    "list"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Current page and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const [purchasesData, suppliersData] = await Promise.all([
          purchasesService.getAll(token),
          suppliersService.getAll(token),
        ]);

        setPurchases(purchasesData.facturas);
        setSuppliers(suppliersData.proveedores);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
        console.error("Error loading purchases data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to get supplier name
  const getSupplierName = (proveedor_id: string) => {
    const supplier = suppliers.find((s) => s.proveedor_id === proveedor_id);
    return supplier?.nombre || "Proveedor no encontrado";
  };

  // Calculate KPIs
  const totalPurchases = purchases.length;
  const pendingPurchases = purchases.filter(
    (p) => p.estado === "pendiente"
  ).length;
  const totalAmount = purchases.reduce(
    (sum, purchase) => sum + parseFloat(purchase.total),
    0
  );
  const pendingAmount = purchases
    .filter((p) => p.estado === "pendiente")
    .reduce((sum, purchase) => sum + parseFloat(purchase.total), 0);

  // Filter purchases
  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      getSupplierName(purchase.proveedor_id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      purchase.factura_compra_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || purchase.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "pagada":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "parcial":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "cancelada":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Cargando módulo de compras...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Módulo de Compras
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona compras, proveedores y control de gastos de tu empresa
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentTime.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleDateString("es-ES", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Compras
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalPurchases}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {pendingPurchases}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
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
                  Monto Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
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
                  Por Pagar
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("list")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Lista de Compras
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "new"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Nueva Compra
              </button>
              <button
                onClick={() => setActiveTab("suppliers")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "suppliers"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Gestión de Proveedores
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Lista de Compras Tab */}
            {activeTab === "list" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Buscar por proveedor o número de factura..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagada">Pagada</option>
                    <option value="parcial">Parcial</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 whitespace-nowrap"
                  >
                    Nueva Compra
                  </button>
                </div>

                {/* Purchases Table */}
                <div className="overflow-hidden shadow ring-1 ring-black dark:ring-gray-600 ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Factura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Proveedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedPurchases.map((purchase) => (
                        <tr
                          key={purchase.factura_compra_id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              #{purchase.factura_compra_id.slice(0, 8)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {purchase.detalle.length} artículo(s)
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {getSupplierName(purchase.proveedor_id)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {purchase.proveedor_id.slice(0, 8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(purchase.fecha)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(purchase.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.estado)}`}
                            >
                              {purchase.estado.charAt(0).toUpperCase() +
                                purchase.estado.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Mostrar
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-2 py-1 text-sm"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          por página
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Mostrando{" "}
                          <span className="font-medium">{startIndex + 1}</span>{" "}
                          a{" "}
                          <span className="font-medium">
                            {Math.min(
                              startIndex + itemsPerPage,
                              filteredPurchases.length
                            )}
                          </span>{" "}
                          de{" "}
                          <span className="font-medium">
                            {filteredPurchases.length}
                          </span>{" "}
                          resultados
                        </p>
                      </div>
                      <div>
                        <nav
                          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            <span className="sr-only">Anterior</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const page = i + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    currentPage === page
                                      ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      : "text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            }
                          )}
                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                          >
                            <span className="sr-only">Siguiente</span>
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nueva Compra Tab */}
            {activeTab === "new" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Crear Nueva Factura de Compra
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    Esta funcionalidad estará disponible próximamente. Permite
                    crear nuevas facturas de compra con selección de proveedores
                    y productos.
                  </p>
                </div>
              </div>
            )}

            {/* Gestión de Proveedores Tab */}
            {activeTab === "suppliers" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Gestión de Proveedores
                  </h3>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2">
                    Nuevo Proveedor
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier.proveedor_id}
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {supplier.nombre}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            RNC/Cédula: {supplier.rnc_cedula}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Tel: {supplier.telefono}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email: {supplier.correo}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              supplier.activo
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            }`}
                          >
                            {supplier.activo ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">
                          Editar
                        </button>
                        <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          {supplier.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
