import { useState, useEffect, useMemo } from "react";
import { useClientStore } from "../../stores/clientStore";
import { Client } from "../../types/types";
import { ClientDetailsModal } from "./components/ClientDetailsModal";
import { clientService } from "../../services/clients/clientService";
import { ClientFormModal } from "../../components/ClientFormModal";

export function ClientsPage() {
  const clients = useClientStore((state) => state.clients);
  const setClients = useClientStore((state) => state.setClients);
  const updateClient = useClientStore((state) => state.updateClient);
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await clientService.getAll();

        // Verificar que se recibieron datos válidos
        if (!data || !Array.isArray(data)) {
          throw new Error("Datos de clientes inválidos recibidos del servidor");
        }

        setClients(data);
      } catch (err: any) {
        console.error("Error fetching clients:", err);

        // Establecer mensaje de error más específico
        let errorMessage =
          "No se pudieron cargar los clientes. Por favor, intente nuevamente.";

        if (err.message?.includes("Token")) {
          errorMessage =
            "Sesión expirada. Por favor, inicie sesión nuevamente.";
        } else if (
          err.message?.includes("conexión") ||
          err.message?.includes("Network")
        ) {
          errorMessage = "Error de conexión. Verifique su conexión a internet.";
        } else if (err.message?.includes("servidor")) {
          errorMessage =
            "Error del servidor. Intente nuevamente en unos minutos.";
        } else if (err.message?.includes("permisos")) {
          errorMessage = "No tiene permisos para ver los clientes.";
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [setClients]);

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) =>
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? client.status === "activo"
            : client.status === "inactivo"
      )
      .filter(
        (client) =>
          (client.name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (client.rnc?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
  }, [clients, searchTerm, statusFilter]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // Resetear a la página 1 cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Generar array de páginas para navegación
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si hay pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 3) {
        // Cerca del inicio
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Cerca del final
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // En medio
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClient(null);
  };

  const handleReactivate = async (clientId: string) => {
    try {
      setIsLoading(true);
      const reactivatedClient = await clientService.reactivate(clientId);
      console.log("Cliente reactivado:", reactivatedClient);

      clients.forEach((client) => {
        if (client.id === clientId) {
          const updatedClient = { ...client, status: "activo" as const };
          updateClient(updatedClient);

          if (selectedClient && selectedClient.id === clientId) {
            setSelectedClient(updatedClient);
          }
        }
      });
    } catch (err) {
      console.error("Error reactivating client:", err);
      alert("No se pudo reactivar el cliente. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (clientId: string) => {
    if (
      confirm(
        "¿Está seguro que desea desactivar este cliente? Podrá reactivarlo más adelante."
      )
    ) {
      try {
        setIsLoading(true);
        await clientService.deactivate(clientId);

        clients.forEach((client) => {
          if (client.id === clientId) {
            const updatedClient = { ...client, status: "inactivo" as const };
            updateClient(updatedClient);

            if (selectedClient && selectedClient.id === clientId) {
              setSelectedClient(updatedClient);
            }
          }
        });
      } catch (err) {
        console.error("Error deactivating client:", err);
        alert("No se pudo desactivar el cliente. Intente nuevamente.");
      } finally {
        setIsLoading(false);
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
    <div className="container mx-auto px-4 py-6">
      {/* Header con título y controles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Clientes
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Administre los clientes de su empresa
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowClientForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Barra de filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o RNC..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items por página
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visualización
            </label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`flex-1 px-4 py-2 text-sm ${
                  viewMode === "table"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Tabla
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 px-4 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Tarjetas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Lista de clientes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-4">
              {searchTerm
                ? "No se encontraron clientes que coincidan con la búsqueda"
                : "No hay clientes registrados"}
            </p>
            <button
              onClick={() => setShowClientForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Registrar nuevo cliente
            </button>
          </div>
        ) : viewMode === "table" ? (
          // Vista de tabla
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RNC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Tipo Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClients.map((client) => (
                  <tr
                    key={client.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      client.status === "inactivo" ? "bg-gray-50" : ""
                    }`}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
                      onClick={() => handleViewClient(client)}
                    >
                      {client.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.rnc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {client.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getBillingTypeLabel(client.billingType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.status === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.status === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded-full transition-colors"
                          onClick={() => handleViewClient(client)}
                          title="Ver detalles"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        {client.status === "activo" ? (
                          <button
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                            onClick={() => handleDeactivate(client.id)}
                            title="Desactivar cliente"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors"
                            onClick={() => handleReactivate(client.id)}
                            title="Reactivar cliente"
                          >
                            <svg
                              className="w-4 h-4"
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
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Vista de tarjetas
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  client.status === "inactivo" ? "opacity-75" : ""
                }`}
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => handleViewClient(client)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">RNC: {client.rnc}</p>
                      {client.phone && (
                        <p className="text-sm text-gray-500">
                          Tel: {client.phone}
                        </p>
                      )}
                      {client.email && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {client.email}
                        </p>
                      )}
                      {client.address && (
                        <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                          <span className="text-gray-400">Dirección:</span>{" "}
                          {client.address}
                        </p>
                      )}
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                        client.status === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {client.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {getBillingTypeLabel(client.billingType)}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                      {getNcfTypeLabel(client.ncfType)}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 flex justify-between">
                  <button
                    onClick={() => handleViewClient(client)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Ver detalles
                  </button>
                  {client.status === "activo" ? (
                    <button
                      onClick={() => handleDeactivate(client.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivate(client.id)}
                      className="text-green-600 hover:text-green-900 text-sm font-medium"
                    >
                      Reactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {!isLoading && !error && filteredClients.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0 text-sm text-gray-500">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, filteredClients.length)} de{" "}
              {filteredClients.length} cliente(s)
              {statusFilter !== "all" && (
                <span>
                  {" "}
                  {statusFilter === "active" ? "activos" : "inactivos"}
                </span>
              )}
              {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
            </div>

            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mr-2 p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Página anterior"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex space-x-1">
                {pageNumbers.map((pageNumber, index) =>
                  pageNumber === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex items-center justify-center w-8 h-8 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber as number)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === pageNumber
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-2 p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Página siguiente"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modales */}
      {showClientForm && (
        <ClientFormModal
          isEdit={false}
          onClose={() => setShowClientForm(false)}
          onSubmit={() => {
            setShowClientForm(false);
          }}
        />
      )}

      {showDetailsModal && selectedClient && (
        <ClientDetailsModal
          client={selectedClient}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
}
