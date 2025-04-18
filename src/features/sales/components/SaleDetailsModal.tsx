import { Sale } from "../types";
import { useClientStore } from "../../../stores/clientStore";

interface SaleDetailsModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const clients = useClientStore((state) => state.clients);
  const client = clients.find((c) => c.id === sale?.clientId);

  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de Venta
          </h2>
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
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Tipo de Venta</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {sale.type === "cash"
                      ? "Contado"
                      : sale.type === "credit"
                        ? "Crédito"
                        : "Mixta"}
                  </dd>
                </div>
                {sale.type === "mixed" && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">
                        Monto en Efectivo
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${sale.cashAmount?.toFixed(2)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Monto a Crédito</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${sale.creditAmount?.toFixed(2)}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Totales</h3>
              <dl className="mt-2 space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${(sale.total - sale.itbis).toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">ITBIS</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${sale.itbis.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Total</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    ${sale.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Productos
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      ITBIS
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
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
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        ${item.itbis.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        ${(item.quantity * item.price + item.itbis).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
