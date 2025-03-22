import { InventoryReport } from "../types";

interface InventorySummaryProps {
  report: InventoryReport;
}

export default function InventorySummary({ report }: InventorySummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {report.totalProductos}
        </p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          ${report.valorTotal.toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm font-medium text-gray-500">
          Productos Stock Bajo
        </h3>
        <p className="mt-2 text-3xl font-semibold text-yellow-600">
          {report.productosBajos}
        </p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm font-medium text-gray-500">
          Productos Críticos
        </h3>
        <p className="mt-2 text-3xl font-semibold text-red-600">
          {report.productosCriticos}
        </p>
      </div>
    </div>
  );
}
