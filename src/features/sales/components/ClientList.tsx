import { Client } from "../types";

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export default function ClientList({
  clients,
  onSelectClient,
  isLoading,
  error,
}: ClientListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error al cargar los clientes: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Lista de Clientes</h2>
      </div>
      <div className="divide-y">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectClient(client)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-gray-600">{client.email}</p>
                <p className="text-sm text-gray-600">{client.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Balance: RD$ {client.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{client.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
