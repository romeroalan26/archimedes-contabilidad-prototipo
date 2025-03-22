import { Product, StockAlert } from "../types";

interface StockAlertsProps {
  alerts: StockAlert[];
  products: Product[];
}

export default function StockAlerts({ alerts, products }: StockAlertsProps) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Alertas de Stock</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {alerts.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">
            No hay alertas de stock en este momento.
          </div>
        ) : (
          alerts.map((alert) => {
            const product = products.find((p) => p.id === alert.productId);
            return (
              <div key={alert.productId} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {product?.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Código: {product?.codigo}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      alert.estado === "critico"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {alert.estado === "critico" ? "Crítico" : "Stock Bajo"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Stock Actual</p>
                    <p className="text-lg font-medium text-gray-900">
                      {alert.stockActual} {product?.unidad}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stock Mínimo</p>
                    <p className="text-lg font-medium text-gray-900">
                      {alert.stockMinimo} {product?.unidad}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Diferencia</p>
                    <p className="text-lg font-medium text-gray-900">
                      {alert.diferencia} {product?.unidad}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    onClick={() => {
                      // TODO: Implementar acción para reabastecer
                      console.log("Reabastecer producto:", product?.id);
                    }}
                  >
                    Reabastecer Stock →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
