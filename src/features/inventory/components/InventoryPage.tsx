import { useState } from "react";
import {
  useProducts,
  useMovements,
  useStockAlerts,
  useInventoryReport,
  useCreateMovement,
} from "../hooks";
import InventoryMovement from "./InventoryMovement";
import ProductList from "./ProductList";
import StockAlerts from "./StockAlerts";
import InventorySummary from "./InventorySummary";
import InventoryAssignment from "./InventoryAssignment";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "movements" | "alerts" | "assignments"
  >("products");

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: movements = [], isLoading: isLoadingMovements } =
    useMovements();
  const { data: alerts = [], isLoading: isLoadingAlerts } = useStockAlerts();
  const { data: report, isLoading: isLoadingReport } = useInventoryReport();
  const createMovement = useCreateMovement();

  if (
    isLoadingProducts ||
    isLoadingMovements ||
    isLoadingAlerts ||
    isLoadingReport
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleMovementSubmit = async (data: any) => {
    await createMovement.mutateAsync({
      ...data,
      productId: parseInt(data.productId),
      cantidad: parseFloat(data.cantidad),
      fecha: new Date().toISOString().split("T")[0],
      usuario: "admin",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Gestión de Inventario
      </h1>

      {/* Resumen del Inventario */}
      {report && (
        <div className="mb-6">
          <InventorySummary report={report} />
        </div>
      )}

      {/* Navegación por Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`${
              activeTab === "products"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("movements")}
            className={`${
              activeTab === "movements"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`${
              activeTab === "alerts"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Alertas de Stock
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`${
              activeTab === "assignments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Asignaciones
          </button>
        </nav>
      </div>

      {/* Contenido de los Tabs */}
      <div className="mt-6">
        {activeTab === "products" && (
          <div className="space-y-6">
            <ProductList products={products} />
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
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">
                Historial de Movimientos
              </h3>
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
                        Motivo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movements.map((movement) => {
                      const product = products.find(
                        (p) => p.id === movement.productId
                      );
                      return (
                        <tr key={movement.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(movement.fecha).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product?.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                movement.tipo === "entrada"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {movement.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {movement.cantidad}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {movement.motivo}
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

        {activeTab === "alerts" && (
          <div className="space-y-6">
            <StockAlerts alerts={alerts} products={products} />
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-6">
            <InventoryAssignment products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
