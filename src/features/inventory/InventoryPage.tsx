import { useState } from "react";
import {
  useProducts,
  useMovements,
  useStockAlerts,
  useInventoryReport,
  useCreateMovement,
} from "./hooks";
import InventoryMovement from "./components/InventoryMovement";
import ProductList from "./components/ProductList";
import StockAlerts from "./components/StockAlerts";
import InventorySummary from "./components/InventorySummary";
import InventoryAssignment from "./components/InventoryAssignment";

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "products"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("movements")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "movements"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "alerts"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Alertas de Stock
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "assignments"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Asignaciones
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        {/* Resumen del Inventario */}
        {report && (
          <div className="mb-6">
            <InventorySummary report={report} />
          </div>
        )}

        {/* Contenido de los Tabs */}
        <div className="h-full overflow-auto">
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
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                          <tr key={movement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(movement.fecha).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product?.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
    </div>
  );
}
