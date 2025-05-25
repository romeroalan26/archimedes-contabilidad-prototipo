import { useState } from "react";
import {
  useProducts,
  useMovements,
  useStockAlerts,
  useInventoryStats,
  useCreateMovement,
  useProductFilter,
} from "./hooks";
import { InventoryStatsCards } from "./components/InventoryStatsCards";
import ProductList from "./components/ProductList";
import StockAlerts from "./components/StockAlerts";
import InventoryMovement from "./components/InventoryMovement";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "movements" | "alerts"
  >("products");

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: movements = [], isLoading: isLoadingMovements } =
    useMovements();
  const { data: alerts = [], isLoading: isLoadingAlerts } = useStockAlerts();
  const { data: stats, isLoading: isLoadingStats } = useInventoryStats();

  const createMovement = useCreateMovement();

  const { filteredProducts, clearFilter, hasActiveFilters } =
    useProductFilter(products);

  if (
    isLoadingProducts ||
    isLoadingMovements ||
    isLoadingAlerts ||
    isLoadingStats
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleMovementSubmit = async (data: any) => {
    await createMovement.mutateAsync({
      ...data,
      productId: parseInt(data.productId),
      cantidad: parseFloat(data.cantidad),
      precioUnitario: parseFloat(data.precioUnitario || 0),
      referencia: data.referencia || "",
      fecha: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
    });
  };

  const tabs = [
    {
      key: "products",
      label: "Productos",
      count: filteredProducts.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      key: "movements",
      label: "Movimientos",
      count: movements.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      key: "alerts",
      label: "Alertas de Stock",
      count: alerts.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.634 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tus productos y controla el stock en tiempo real
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilter}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Limpiar Filtros
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="mb-8">
            <InventoryStatsCards stats={stats} />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`mr-2 ${
                      activeTab === tab.key
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                        activeTab === tab.key
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "products" && (
            <div className="space-y-6">
              <ProductList products={filteredProducts} />
            </div>
          )}

          {activeTab === "movements" && (
            <div className="space-y-6">
              <InventoryMovement
                products={products}
                onSubmit={handleMovementSubmit}
                isLoading={createMovement.isPending}
                error={createMovement.error}
              />

              {/* Historial de Movimientos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Historial de Movimientos
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Últimos movimientos de inventario registrados
                  </p>
                </div>
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Unit.
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Motivo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usuario
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {movements.slice(0, 20).map((movement) => {
                          const product = products.find(
                            (p) => p.id === movement.productId
                          );
                          return (
                            <tr key={movement.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(movement.fecha).toLocaleDateString(
                                  "es-DO"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {product?.nombre}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product?.codigo}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    movement.tipo === "entrada"
                                      ? "bg-green-100 text-green-800"
                                      : movement.tipo === "salida"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {movement.tipo.charAt(0).toUpperCase() +
                                    movement.tipo.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {movement.cantidad.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Intl.NumberFormat("es-DO", {
                                  style: "currency",
                                  currency: "DOP",
                                }).format(movement.precioUnitario)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {movement.motivo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {movement.usuario}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                {movements.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay movimientos
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza registrando un movimiento de inventario.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "alerts" && (
            <div className="space-y-6">
              <StockAlerts alerts={alerts} products={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
