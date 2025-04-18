import { useClientStore } from "../../../stores/clientStore";
import { useState } from "react";
import { ClientForm } from "../../../components/ClientForm";
import { Client } from "../../../types/types";

interface ClientListProps {
  onSelectClient?: (client: Client) => void;
  selectedClient?: Client | null;
}

export function ClientList({
  onSelectClient,
  selectedClient,
}: ClientListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button
          onClick={() => setIsEditing("new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Nuevo Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No hay clientes registrados</p>
          <button
            onClick={() => setIsEditing("new")}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Registrar nuevo cliente
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RNC/Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NCF
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className={`${
                      onSelectClient ? "cursor-pointer hover:bg-gray-50" : ""
                    } ${
                      selectedClient?.id === client.id
                        ? "bg-indigo-50 hover:bg-indigo-100"
                        : ""
                    }`}
                    onClick={() => onSelectClient && handleClientClick(client)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {client.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {client.rnc}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {client.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {client.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {client.billingType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {client.ncfType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(client.id);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(client.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
