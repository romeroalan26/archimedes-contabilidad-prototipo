import { useState } from "react";
import type { Client } from "../types";
import { useClientStore } from "../../../stores/clientStore";

interface ClientListProps {
  clients?: Client[];
  onSelectClient?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onCreateNew?: () => void;
  selectedClientId?: string;
}

export default function ClientList({
  clients = [],
  onSelectClient,
  onEdit,
  onCreateNew,
  selectedClientId,
}: ClientListProps) {
  const [search, setSearch] = useState("");
  const { deleteClient } = useClientStore();

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.rnc.includes(search)
  );

  const handleDelete = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este cliente?")) {
      deleteClient(id);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Clientes</h3>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Nuevo Cliente
          </button>
        )}
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o RNC"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay clientes registrados
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nombre</th>
                <th>RNC</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Tipo Facturación</th>
                <th>Tipo NCF</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className={`border-b ${selectedClientId === client.id ? "bg-blue-50" : ""} ${onSelectClient ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={() => onSelectClient?.(client)}
                >
                  <td className="py-1">{client.name}</td>
                  <td>{client.rnc}</td>
                  <td>{client.phone || "-"}</td>
                  <td>{client.email || "-"}</td>
                  <td className="capitalize">{client.billingType}</td>
                  <td className="capitalize">{client.ncfType}</td>
                  <td
                    className="space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(client);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(client.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
