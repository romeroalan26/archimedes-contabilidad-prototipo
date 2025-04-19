import { useState } from "react";
import { Sale } from "../types";
import { SaleDetailsModal } from "./SaleDetailsModal";
import { generateInvoicePDF } from "./InvoicePDF";
import { useClientStore } from "../../../stores/clientStore";

interface SalesHistoryProps {
  sales: Sale[];
  isLoading?: boolean;
  error?: Error | null;
}

export function SalesHistory({ sales, isLoading, error }: SalesHistoryProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const clients = useClientStore((state) => state.clients);

  console.log("SalesHistory received sales:", sales);

  const handlePrintInvoice = (sale: Sale) => {
    const client = clients.find((c) => c.id === sale.clientId);
    if (client) {
      generateInvoicePDF({ sale, client });
    }
  };

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
    <>
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
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avance
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pendiente
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
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
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  ${sale.advancePayment?.toFixed(2) || "0.00"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  ${sale.remainingBalance?.toFixed(2) || "0.00"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handlePrintInvoice(sale)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                    title="Imprimir Factura"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedSale(sale)}
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

      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </>
  );
}
