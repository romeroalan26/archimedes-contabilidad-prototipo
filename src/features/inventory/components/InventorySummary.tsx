import { InventoryReport } from "../types";

interface InventorySummaryProps {
  report: InventoryReport;
}

export default function InventorySummary({ report }: InventorySummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Resumen de Inventario
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-indigo-800">
            Total Productos
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {report.totalProductos}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Valor Total</h3>
          <p className="text-2xl font-bold text-green-600">
            ${report.valorTotal.toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">
            Productos con Stock Bajo
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {report.productosBajos}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">
            Productos Críticos
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {report.productosCriticos}
          </p>
        </div>
      </div>
    </div>
  );
}
