import { Sale } from "../types";

interface SalesHistoryProps {
  sales: Sale[];
  isLoading?: boolean;
  error?: Error | null;
}

export function SalesHistory({ sales, isLoading, error }: SalesHistoryProps) {
  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay ventas registradas
      </div>
    );
  }

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
              Total
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ITBIS
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {new Date(sale.date).toLocaleDateString()}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {sale.clientId}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                ${sale.total.toFixed(2)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                ${sale.itbis.toFixed(2)}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : sale.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {sale.status === "completed"
                    ? "Completada"
                    : sale.status === "pending"
                      ? "Pendiente"
                      : "Cancelada"}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {sale.type === "cash"
                  ? "Contado"
                  : sale.type === "credit"
                    ? "Crédito"
                    : "Mixta"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
