import { useClientStore } from "../../../stores/clientStore";
import { useState, useEffect, useMemo } from "react";
import { Client } from "../../../types/types";
import { clientService } from "../../../services/clients/clientService";
import { ClientFormModal } from "../../../components/ClientFormModal";

// Mapeo de tipos de facturación a etiquetas compactas
const billingTypeLabels: Record<string, string> = {
  contado: "Contado",
  credito: "Crédito",
  mixto: "Mixto",
};

interface ClientListProps {
  onSelectClient?: (client: Client) => void;
  selectedClient?: Client | null;
}

export function ClientList({
  onSelectClient,
  selectedClient,
}: ClientListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const clients = useClientStore((state) => state.clients);
  const setClients = useClientStore((state) => state.setClients);
  // const updateClient = useClientStore((state) => state.updateClient);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14; // Optimizado para vista súper compacta

  // Función para obtener los clientes activos desde la API
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allClientsData = await clientService.getAll();

      if (!allClientsData || !Array.isArray(allClientsData)) {
        throw new Error("Datos de clientes inválidos recibidos del servidor");
      }

      setClients(allClientsData);
    } catch (err: any) {
      console.error("Error fetching clients:", err);

      let errorMessage = "No se pudieron cargar los clientes.";
      if (err.message?.includes("Token")) {
        errorMessage = "Sesión expirada. Por favor, inicie sesión nuevamente.";
      } else if (
        err.message?.includes("conexión") ||
        err.message?.includes("Network")
      ) {
        errorMessage = "Error de conexión. Verifique su conexión a internet.";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [setClients]);

  // Obtenemos solo los clientes activos para mostrar en la interfaz
  const activeClients = useMemo(() => {
    return clients.filter((client) => client.status === "activo");
  }, [clients]);

  const handleClientClick = (client: Client) => {
    onSelectClient?.(client);
  };

  const filteredClients = useMemo(() => {
    const filtered = activeClients.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.rnc &&
          client.rnc.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Resetear a la primera página si el filtro cambia
    setCurrentPage(1);

    return filtered;
  }, [activeClients, searchTerm]);

  // Lógica de paginación
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Renderizado compacto optimizado
  const renderCompactList = () => (
    <div className="space-y-1">
      {paginatedClients.map((client) => (
        <div
          key={client.id}
          className={`group relative p-2 rounded-md cursor-pointer transition-all duration-150 ${
            selectedClient?.id === client.id
              ? "bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 shadow-sm"
              : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
          }`}
          onClick={() => handleClientClick(client)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {/* Avatar compacto */}
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    {client.name?.charAt(0)?.toUpperCase() || "C"}
                  </span>
                </div>
              </div>

              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {client.name}
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {billingTypeLabels[client.billingType]}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {client.rnc}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {client.rnc?.length === 11 ? "RNC" : "Cédula"}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador de selección */}
            <div className="flex-shrink-0">
              {selectedClient?.id === client.id ? (
                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full group-hover:border-indigo-300 dark:group-hover:border-indigo-500"></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente de controles de paginación compacto
  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} de{" "}
              {filteredClients.length}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-3 w-3"
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

              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                const isCurrentPage = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`relative inline-flex items-center px-2 py-1 border text-xs font-medium ${
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
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="h-3 w-3"
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
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header compacto */}
      <div className="flex-none p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
            Clientes ({filteredClients.length})
          </h3>
          <button
            onClick={() => setIsEditing("new")}
            className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center"
          >
            <svg
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Nuevo
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-2 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
          />
          <div className="absolute inset-y-0 left-0 pl-1.5 flex items-center pointer-events-none">
            <svg
              className="h-3 w-3 text-gray-400 dark:text-gray-500"
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

      {/* Lista de clientes */}
      <div className="flex-1 overflow-auto px-2 py-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs"
            >
              Reintentar
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-6">
            <svg
              className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600"
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
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
              Sin coincidencias
            </p>
            <button
              onClick={() => setIsEditing("new")}
              className="mt-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-xs"
            >
              Registrar cliente
            </button>
          </div>
        ) : (
          renderCompactList()
        )}
      </div>

      {/* Controles de paginación */}
      {filteredClients.length > 0 && renderPaginationControls()}

      {isEditing && (
        <ClientFormModal
          defaultValues={
            isEditing !== "new"
              ? clients.find((c) => c.id === isEditing)
              : undefined
          }
          isEdit={isEditing !== "new"}
          onClose={() => setIsEditing(null)}
          onSubmit={(client) => {
            if (isEditing !== "new" && onSelectClient) {
              onSelectClient(client);
            }
            setIsEditing(null);
          }}
        />
      )}
    </div>
  );
}
