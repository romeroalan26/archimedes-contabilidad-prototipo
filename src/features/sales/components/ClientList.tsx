import { useClientStore } from "../../../stores/clientStore";
import { useState } from "react";
import { ClientForm } from "../../../components/ClientForm";
import { Client } from "../../../types/types";

// Mapeo de tipos técnicos a etiquetas amigables
const ncfTypeLabels: Record<Client["ncfType"], string> = {
  consumidor_final: "01 - Consumidor Final",
  credito_fiscal: "02 - Crédito Fiscal",
  gubernamental: "14 - Gubernamental",
  regimen_especial: "15 - Régimen Especial",
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
  const deleteClient = useClientStore((state) => state.deleteClient);

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este cliente?")) {
      deleteClient(id);
    }
  };

  const handleClientClick = (client: Client) => {
    onSelectClient?.(client);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rnc.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow">
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Clientes</h2>
          <button
            onClick={() => setIsEditing("new")}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
          >
            Nuevo Cliente
          </button>
        </div>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay clientes registrados</p>
            <button
              onClick={() => setIsEditing("new")}
              className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Registrar nuevo cliente
            </button>
          </div>
        ) : (
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
                      <p className="text-sm text-gray-500">
                        Tel: {client.phone}
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
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {client.billingType}
                  </span>
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {ncfTypeLabels[client.ncfType]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing === "new" ? "Nuevo Cliente" : "Editar Cliente"}
              </h2>
              <button
                onClick={() => setIsEditing(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
            <ClientForm
              defaultValues={
                isEditing !== "new"
                  ? clients.find((c) => c.id === isEditing)
                  : undefined
              }
              isEdit={isEditing !== "new"}
              onClose={() => setIsEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
