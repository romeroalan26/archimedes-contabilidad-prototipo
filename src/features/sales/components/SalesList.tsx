import { Sale } from "../types";
import { formatCurrency } from "../../../utils/formatters";

interface SalesListProps {
  sales: Sale[];
  onViewSale: (saleId: string) => void;
}

export function SalesList({ sales, onViewSale }: SalesListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "partial":
        return "Parcial";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  const getSaleTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Contado";
      case "credit":
        return "Crédito";
      case "mixed":
        return "Mixto";
      default:
        return type;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ITBIS
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pagado
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {new Date(sale.date).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {sale.clientId}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {getSaleTypeLabel(sale.type)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(sale.total)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(sale.itbis)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(sale.totalPaid || 0)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(sale.remainingBalance || 0)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    sale.status
                  )}`}
                >
                  {getStatusLabel(sale.status)}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onViewSale(sale.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
