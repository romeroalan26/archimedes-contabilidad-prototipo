import { useClientStore } from "../../../stores/clientStore";
import { useState, useEffect, useMemo } from "react";
import { Client } from "../../../types/types";
import { clientService } from "../../../services/clients/clientService";
import { ClientFormModal } from "../../../components/ClientFormModal";

// Mapeo de tipos técnicos a etiquetas amigables
const ncfTypeLabels: Record<Client["ncfType"], string> = {
  consumidor_final: "01 - Consumidor Final",
  credito_fiscal: "02 - Crédito Fiscal",
  gubernamental: "14 - Gubernamental",
  regimen_especial: "15 - Régimen Especial",
};

// Mapeo de tipos de facturación a etiquetas amigables
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
  const updateClient = useClientStore((state) => state.updateClient);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "grid">("compact");

  // Función para obtener los clientes activos desde la API y SOLO mostrarlos localmente
  // sin afectar a los clientes inactivos en el store
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtener TODOS los clientes (activos e inactivos)
      const allClientsData = await clientService.getAll();

      // Actualizar el store con todos los clientes
      // Esto mantiene tanto los activos como los inactivos
      setClients(allClientsData);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("No se pudieron cargar los clientes.");
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

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Está seguro que desea desactivar este cliente? Podrá reactivarlo más adelante."
      )
    ) {
      try {
        // Desactivar en el backend
        await clientService.deactivate(id);

        // Obtener referencia al cliente antes de procesar
        const clientToDelete = clients.find((c) => c.id === id);

        if (clientToDelete) {
          // Actualizar el cliente en el store global con estado inactivo
          updateClient({ ...clientToDelete, status: "inactivo" as const });
        }

        // Si el cliente desactivado estaba seleccionado, seleccionar otro
        if (selectedClient?.id === id && onSelectClient) {
          const remainingActiveClients = activeClients.filter(
            (c) => c.id !== id
          );
          if (remainingActiveClients.length > 0) {
            onSelectClient(remainingActiveClients[0]);
          }
        }

        // Informar al usuario
        alert(
          `Cliente ${clientToDelete?.name || id} desactivado correctamente.`
        );
      } catch (err) {
        console.error("Error desactivando cliente:", err);
        alert("No se pudo desactivar el cliente. Intente nuevamente.");
      }
    }
  };

  const handleClientClick = (client: Client) => {
    onSelectClient?.(client);
  };

  const filteredClients = useMemo(() => {
    return activeClients.filter(
      (client) =>
        (client.name &&
          client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.rnc &&
          client.rnc.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [activeClients, searchTerm]);

  // Renderizado de la lista en modo compacto (tabla)
  const renderCompactView = () => (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RNC
            </th>
            <th className="hidden md:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="hidden lg:table-cell px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filteredClients.map((client) => (
            <tr
              key={client.id}
              className={`hover:bg-gray-50 cursor-pointer transition duration-150 ${
                selectedClient?.id === client.id ? "bg-indigo-50" : ""
              }`}
              onClick={() => handleClientClick(client)}
            >
              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {client.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {client.rnc}
              </td>
              <td className="hidden md:table-cell px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                {client.phone || "-"}
              </td>
              <td className="hidden lg:table-cell px-3 py-2 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-1">
                  <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {billingTypeLabels[client.billingType]}
                  </span>
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(client.id);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(client.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                    title="Desactivar cliente"
                  >
                    <svg
                      className="h-4 w-4"
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Renderizado de la lista en modo tarjetas (grid)
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {filteredClients.map((client) => (
        <div
          key={client.id}
          className={`p-3 border rounded-md cursor-pointer ${
            selectedClient?.id === client.id
              ? "bg-indigo-50 border-indigo-300"
              : "hover:bg-gray-50"
          }`}
          onClick={() => onSelectClient && handleClientClick(client)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{client.name}</h3>
              <p className="text-sm text-gray-500">RNC: {client.rnc}</p>
              {client.phone && (
                <p className="text-sm text-gray-500">Tel: {client.phone}</p>
              )}
              {client.address && (
                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                  Dir: {client.address}
                </p>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(client.id);
                }}
                className="text-indigo-600 hover:text-indigo-900 text-xs"
              >
                Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(client.id);
                }}
                className="text-red-600 hover:text-red-900 text-xs"
              >
                Desactivar
              </button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {billingTypeLabels[client.billingType]}
            </span>
            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {ncfTypeLabels[client.ncfType]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Clientes</h2>
          <div className="flex space-x-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("compact")}
                className={`px-2 py-1 text-xs ${
                  viewMode === "compact"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                title="Vista compacta"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2 py-1 text-xs ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                title="Vista de tarjetas"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setIsEditing("new")}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm flex items-center"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nuevo
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o RNC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
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

      <div className="flex-1 overflow-auto px-2 py-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Reintentar
            </button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
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
            <p className="mt-2 text-gray-500">
              No hay clientes que coincidan con su búsqueda
            </p>
            <button
              onClick={() => setIsEditing("new")}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Registrar nuevo cliente
            </button>
          </div>
        ) : viewMode === "compact" ? (
          renderCompactView()
        ) : (
          renderGridView()
        )}
      </div>

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
