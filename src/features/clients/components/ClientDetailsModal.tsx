import { useState } from "react";
import { Client } from "../../../types/types";
import { useClientStore } from "../../../stores/clientStore";
import { useSalesStore } from "../../../stores/salesStore";
import { formatCurrency } from "../../../utils/formatters";
import { ClientFormModal } from "../../../components/ClientFormModal";
import { clientService } from "../../../services/clients/clientService";

interface ClientDetailsModalProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetailsModal({
  client: initialClient,
  onClose,
}: ClientDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "sales">("info");
  const updateClient = useClientStore((state) => state.updateClient);
  const sales = useSalesStore((state) => state.sales);

  // Obtener el cliente actualizado del store
  const clients = useClientStore((state) => state.clients);
  const client =
    clients.find((c) => c.id === initialClient.id) || initialClient;

  // Filter sales for this client
  const clientSales = sales.filter((sale) => sale.clientId === client.id);

  // Calcular estadísticas de ventas
  const salesStats = {
    total: clientSales.reduce((sum, sale) => sum + sale.total, 0),
    count: clientSales.length,
    pending: clientSales.filter((sale) => sale.status === "pending").length,
    completed: clientSales.filter((sale) => sale.status === "completed").length,
    partial: clientSales.filter((sale) => sale.status === "partial").length,
  };

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

  const handleReactivate = async () => {
    if (confirm("¿Está seguro que desea reactivar este cliente?")) {
      try {
        const reactivatedClient = await clientService.reactivate(client.id);
        console.log("Cliente reactivado:", reactivatedClient);

        // Actualizar el cliente en el store con el estado correcto
        updateClient({ ...client, status: "activo" as const });

        // Cerrar el modal después de reactivar
        onClose();
      } catch (error) {
        console.error("Error al reactivar cliente:", error);
        alert("No se pudo reactivar el cliente. Intente nuevamente.");
      }
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Encabezado */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Detalles del Cliente
              <span className="ml-2 text-sm font-normal text-gray-500">
                #{client.id.substring(0, 8)}
              </span>
            </h2>
            <p className="text-sm text-gray-500">
              {client.status === "activo"
                ? "Información detallada del cliente"
                : "Este cliente está actualmente inactivo"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </button>
                {client.status === "inactivo" && (
                  <button
                    onClick={handleReactivate}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <svg
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reactivar
                  </button>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              aria-label="Cerrar"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6 -mb-px">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "sales"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Historial de Ventas
              {clientSales.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                  {clientSales.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          {isEditing ? (
            <div className="p-6">
              <ClientFormModal
                defaultValues={client}
                isEdit={true}
                onClose={handleCloseEdit}
                onSubmit={handleUpdateClient}
              />
            </div>
          ) : (
            <div className="p-6">
              {activeTab === "info" ? (
                <div className="space-y-8">
                  {/* Estado del cliente */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`p-3 rounded-full mr-4 ${
                          client.status === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {client.status === "activo" ? (
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
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
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Cliente{" "}
                          {client.status === "activo" ? "activo" : "inactivo"} •{" "}
                          {getBillingTypeLabel(client.billingType)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getBillingTypeLabel(client.billingType)}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {getNcfTypeLabel(client.ncfType)}
                      </span>
                    </div>
                  </div>

                  {/* Información del cliente en cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">
                          Información de Contacto
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              RNC / Cédula
                            </p>
                            <p className="text-sm text-gray-500">
                              {client.rnc}
                            </p>
                          </div>
                        </div>

                        {client.phone && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                Teléfono
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.phone}
                              </p>
                            </div>
                          </div>
                        )}

                        {client.email && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                Email
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.email}
                              </p>
                            </div>
                          </div>
                        )}

                        {client.address && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                Dirección
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.address}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">
                          Información de Facturación
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Tipo de Facturación
                            </p>
                            <p className="text-sm text-gray-500">
                              {getBillingTypeLabel(client.billingType)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              Tipo de NCF
                            </p>
                            <p className="text-sm text-gray-500">
                              {getNcfTypeLabel(client.ncfType)}
                            </p>
                          </div>
                        </div>

                        {clientSales.length > 0 && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                Total en Ventas
                              </p>
                              <p className="text-sm text-indigo-600 font-semibold">
                                {formatCurrency(salesStats.total)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de ventas */}
                  {clientSales.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">
                          Resumen de Actividad
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-3 bg-indigo-50 rounded-lg">
                            <p className="text-xs text-indigo-500 font-medium">
                              Ventas Totales
                            </p>
                            <p className="text-lg font-bold text-indigo-600">
                              {salesStats.count}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-500 font-medium">
                              Completadas
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              {salesStats.completed}
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-xs text-yellow-500 font-medium">
                              Parciales
                            </p>
                            <p className="text-lg font-bold text-yellow-600">
                              {salesStats.partial}
                            </p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-xs text-red-500 font-medium">
                              Pendientes
                            </p>
                            <p className="text-lg font-bold text-red-600">
                              {salesStats.pending}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cabecera del historial de ventas */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-900">
                      Historial de Ventas
                    </h3>
                    {clientSales.length > 0 && (
                      <span className="text-sm text-gray-500">
                        Total: {formatCurrency(salesStats.total)}
                      </span>
                    )}
                  </div>

                  {/* Lista de ventas */}
                  {clientSales.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Fecha
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Total
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Estado
                              </th>
                              <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tipo
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {clientSales.map((sale) => (
                              <tr
                                key={sale.id}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {new Date(sale.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(sale.date).toLocaleTimeString()}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatCurrency(sale.total)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ITBIS: {formatCurrency(sale.itbis)}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      sale.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : sale.status === "partial"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {sale.status === "completed"
                                      ? "Completada"
                                      : sale.status === "partial"
                                        ? "Parcial"
                                        : "Pendiente"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {sale.type === "cash"
                                      ? "Contado"
                                      : sale.type === "credit"
                                        ? "Crédito"
                                        : "Mixta"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hay ventas registradas
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Este cliente aún no tiene ninguna venta registrada.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
