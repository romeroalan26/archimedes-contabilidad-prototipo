import { useState, useEffect, useMemo } from "react";
import { useClientStore } from "../../stores/clientStore";
import { useAuth } from "../../stores/authStore";
import { Client } from "../../types/types";
import { ClientDetailsModal } from "./components/ClientDetailsModal";
import { clientService } from "../../services/clients/clientService";
import { ClientFormModal } from "../../components/ClientFormModal";

export function ClientsPage() {
  const {
    /* user */
  } = useAuth();
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
  // const pageNumbers = useMemo(() => {
  //   const pages = [];
  //   const maxVisiblePages = 5;
  //   const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  //   const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  //   for (let i = startPage; i <= endPage; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }, [currentPage, totalPages]);

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
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Gestión de Clientes
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Administre y consulte todos los clientes de su empresa
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => setShowClientForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium flex items-center"
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barra de filtros y búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar Cliente
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nombre o RNC..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Items por página
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visualización
              </label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex-1 px-4 py-2 text-sm ${
                    viewMode === "table"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
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
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 dark:text-red-400 mb-4">
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Reintentar
              </button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {searchTerm
                  ? "No se encontraron clientes que coincidan con la búsqueda"
                  : "No hay clientes registrados"}
              </p>
              <button
                onClick={() => setShowClientForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                Registrar nuevo cliente
              </button>
            </div>
          ) : viewMode === "table" ? (
            // Vista de tabla
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      RNC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                      Tipo Facturación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        client.status === "inactivo"
                          ? "bg-gray-50 dark:bg-gray-700/30"
                          : ""
                      }`}
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                        onClick={() => handleViewClient(client)}
                      >
                        {client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {client.rnc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {client.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {client.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {getBillingTypeLabel(client.billingType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.status === "activo"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          }`}
                        >
                          {client.status === "activo" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-1.5 rounded-full transition-colors"
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
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 p-1.5 rounded-full transition-colors"
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
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 p-1.5 rounded-full transition-colors"
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
                  className={`border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    client.status === "inactivo" ? "opacity-75" : ""
                  }`}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => handleViewClient(client)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          RNC: {client.rnc}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Tel: {client.phone}
                          </p>
                        )}
                        {client.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {client.email}
                          </p>
                        )}
                        {client.address && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs mt-1">
                            <span className="text-gray-400 dark:text-gray-500">
                              Dirección:
                            </span>{" "}
                            {client.address}
                          </p>
                        )}
                      </div>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                          client.status === "activo"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {client.status === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {getBillingTypeLabel(client.billingType)}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {getNcfTypeLabel(client.ncfType)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 flex justify-between">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-sm font-medium"
                    >
                      Ver detalles
                    </button>
                    {client.status === "activo" ? (
                      <button
                        onClick={() => handleDeactivate(client.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(client.id)}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-sm font-medium"
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
          <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg mt-6">
            <div className="flex items-center justify-between">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Mostrando{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredClients.length
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {filteredClients.length}
                    </span>{" "}
                    cliente(s)
                    {statusFilter !== "all" && (
                      <span>
                        {" "}
                        {statusFilter === "active" ? "activos" : "inactivos"}
                      </span>
                    )}
                    {searchTerm && (
                      <span> que coinciden con "{searchTerm}"</span>
                    )}
                  </p>
                </div>
                {totalPages > 1 && (
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;

                        // Show first page, last page, current page, and pages around current
                        const shouldShow =
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1;

                        if (!shouldShow) {
                          // Show ellipsis for gaps
                          if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNumber}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              isCurrentPage
                                ? "z-10 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-600 text-indigo-600 dark:text-indigo-300"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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
