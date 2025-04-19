import { Sale } from "../types";
import { useClientStore } from "../../../stores/clientStore";
import { generateInvoicePDF } from "./InvoicePDF";
import { SalePayments } from "./SalePayments";
import { useSalesStore } from "../../../stores/salesStore";
import { formatCurrency } from "../../../utils/formatters";

interface SaleDetailsModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const clients = useClientStore((state) => state.clients);
  const client = clients.find((c) => c.id === sale?.clientId);
  const updateSale = useSalesStore((state) => state.updateSale);

  if (!sale) return null;

  const handlePrintInvoice = () => {
    if (client) {
      generateInvoicePDF({ sale, client });
    }
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    updateSale(updatedSale);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
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
      case "cancelled":
        return "Cancelado";
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de Venta
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="h-4 w-4 mr-1"
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
              Imprimir Factura
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Información General
              </h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Fecha</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(sale.date).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Cliente</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {client?.name || sale.clientId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Estado</dt>
                  <dd>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        sale.status
                      )}`}
                    >
                      {getStatusLabel(sale.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Tipo</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {getSaleTypeLabel(sale.type)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatCurrency(sale.total)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ITBIS</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatCurrency(sale.itbis)}
                  </dd>
                </div>
                {sale.type === "mixed" && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">
                        Monto en Efectivo
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(sale.cashAmount || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Monto a Crédito</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(sale.creditAmount || 0)}
                      </dd>
                    </div>
                  </>
                )}
                {sale.type === "credit" && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">Avance</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(sale.advancePayment || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">
                        Balance Pendiente
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {formatCurrency(sale.remainingBalance || 0)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Productos
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ITBIS
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sale.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.productId}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.itbis)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.quantity * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-2 text-right text-sm font-medium text-gray-500"
                      >
                        Total:
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(sale.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Sección de Pagos */}
          {(sale.type === "credit" || sale.type === "mixed") && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Historial de Pagos
              </h3>
              <SalePayments sale={sale} onUpdateSale={handleUpdateSale} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
