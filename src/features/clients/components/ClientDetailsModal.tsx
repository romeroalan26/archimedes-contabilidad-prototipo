import { useState } from "react";
import { Client } from "../../../types/types";
import { useClientStore } from "../../../stores/clientStore";
import { ClientForm } from "../../../components/ClientForm";
import { useSalesStore } from "../../../stores/salesStore";
import { formatCurrency } from "../../../utils/formatters";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetailsModal({
  client: initialClient,
  onClose,
}: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateClient = useClientStore((state) => state.updateClient);
  const sales = useSalesStore((state) => state.sales);

  // Obtener el cliente actualizado del store
  const clients = useClientStore((state) => state.clients);
  const client =
    clients.find((c) => c.id === initialClient.id) || initialClient;

  // Filter sales for this client
  const clientSales = sales.filter((sale) => sale.clientId === client.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    updateClient(updatedClient);
    setIsEditing(false);
  };

  const getBillingTypeLabel = (type: string) => {
    switch (type) {
      case "contado":
        return "Contado";
      case "credito":
        return "Crédito";
      case "mixto":
        return "Mixto";
      default:
        return type;
    }
  };

  const getNcfTypeLabel = (type: string) => {
    switch (type) {
      case "consumidor_final":
        return "01 - Consumidor Final";
      case "credito_fiscal":
        return "02 - Crédito Fiscal";
      case "gubernamental":
        return "14 - Gubernamental";
      case "regimen_especial":
        return "15 - Régimen Especial";
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles del Cliente
          </h2>
          <div className="flex items-center space-x-4">
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Editar
              </button>
            )}
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
          {isEditing ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Editar Cliente
              </h3>
              <ClientForm
                defaultValues={client}
                isEdit={true}
                onClose={handleCloseEdit}
                onSubmit={handleUpdateClient}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Información General
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-gray-500">Nombre</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">RNC</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.rnc}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Teléfono</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.phone || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {client.email || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">
                      Tipo de Facturación
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {getBillingTypeLabel(client.billingType)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Tipo de NCF</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {getNcfTypeLabel(client.ncfType)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Estado</dt>
                    <dd>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.status === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.status === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Historial de Ventas
                </h3>
                {clientSales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientSales.map((sale) => (
                          <tr key={sale.id}>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {new Date(sale.date).toLocaleDateString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(sale.total)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  sale.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : sale.status === "partial"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {sale.status === "completed"
                                  ? "Completado"
                                  : sale.status === "partial"
                                    ? "Parcial"
                                    : "Pendiente"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay ventas registradas para este cliente.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
