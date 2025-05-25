import { StockAlert } from "../types";

interface StockAlertsProps {
  alerts: StockAlert[];
  products: any[];
}

export default function StockAlerts({ alerts }: StockAlertsProps) {
  // Alert Card Component (Mobile/Tablet view)
  const AlertCard = ({ alert }: { alert: StockAlert }) => (
    <div
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        alert.nivel === "critico"
          ? "border-red-200 bg-red-50"
          : "border-yellow-200 bg-yellow-50"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 text-sm">
              {alert.nombre}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {alert.codigo}
            </span>
          </div>
          <p className="text-xs text-gray-600">{alert.categoria}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            alert.nivel === "critico"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {alert.nivel === "critico" ? "🚨 Crítico" : "⚠️ Bajo"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <div className="text-gray-500 mb-1">Stock Actual</div>
          <div
            className={`text-lg font-bold ${
              alert.nivel === "critico" ? "text-red-600" : "text-yellow-600"
            }`}
          >
            {alert.stockActual}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 mb-1">Stock Mínimo</div>
          <div className="text-lg font-medium text-gray-900">
            {alert.stockMinimo}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 mb-1">Diferencia</div>
          <div
            className={`text-lg font-bold ${
              alert.diferencia < 0 ? "text-red-600" : "text-yellow-600"
            }`}
          >
            {alert.diferencia}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Alertas de Stock
        </h2>
        <div className="text-sm text-gray-500">
          {alerts.filter((a) => a.nivel === "bajo").length} Bajos •{" "}
          {alerts.filter((a) => a.nivel === "critico").length} Críticos
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin alertas de stock
          </h3>
          <p className="text-gray-500">
            Todos los productos tienen niveles de stock adecuados.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {alerts.map((alert) => (
                <AlertCard key={alert.productId} alert={alert} />
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Actual
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Mínimo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diferencia
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alerts.map((alert) => (
                    <tr
                      key={alert.productId}
                      className={`hover:bg-gray-50 transition-colors ${
                        alert.nivel === "critico" ? "bg-red-50" : "bg-yellow-50"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {alert.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            {alert.codigo}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {alert.categoria}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`text-sm font-medium ${
                            alert.nivel === "critico"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {alert.stockActual}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">
                        {alert.stockMinimo}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`text-sm font-medium ${
                            alert.diferencia < 0
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {alert.diferencia}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            alert.nivel === "critico"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {alert.nivel === "critico" ? "🚨 Crítico" : "⚠️ Bajo"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
