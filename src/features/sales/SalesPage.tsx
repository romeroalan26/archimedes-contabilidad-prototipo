import { useState } from "react";
import { Client, Sale } from "./types";
import { mockClients, mockAccountStatements } from "./salesData";
import ClientList from "./components/ClientList";
import SalesForm from "./components/SalesForm";
import AccountStatementComponent from "./components/AccountStatement";

// TODO: Reemplazar con React Query cuando esté disponible
const useClients = () => {
  // Simulación de datos - Reemplazar con React Query
  return {
    data: mockClients,
    isLoading: false,
    error: null,
  };
};

const useAccountStatements = (clientId?: number) => {
  // Simulación de datos - Reemplazar con React Query
  return {
    data: clientId
      ? mockAccountStatements.filter((s) => s.clientId === clientId)
      : [],
    isLoading: false,
    error: null,
  };
};

const useCreateSale = () => {
  // Simulación de mutación - Reemplazar con React Query
  return {
    mutate: async (sale: Omit<Sale, "id">) => {
      console.log("Creando venta:", sale);
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sale;
    },
    isLoading: false,
    error: null,
  };
};

export default function SalesPage() {
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const {
    data: clients,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useClients();
  const {
    data: statements,
    isLoading: isLoadingStatements,
    error: statementsError,
  } = useAccountStatements(selectedClient?.id);
  const {
    mutate: createSale,
    isLoading: isCreatingSale,
    error: createSaleError,
  } = useCreateSale();

  const handleCreateSale = async (sale: Omit<Sale, "id">) => {
    try {
      await createSale(sale);
      // TODO: Actualizar la lista de ventas y el estado de cuenta
    } catch (error) {
      console.error("Error al crear la venta:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Ventas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ClientList
            clients={clients || []}
            onSelectClient={setSelectedClient}
            isLoading={isLoadingClients}
            error={clientsError}
          />
          <SalesForm
            client={selectedClient}
            onSubmit={handleCreateSale}
            isLoading={isCreatingSale}
            error={createSaleError}
            onClearClient={() => setSelectedClient(undefined)}
          />
        </div>
        <div>
          <AccountStatementComponent
            statements={statements || []}
            isLoading={isLoadingStatements}
            error={statementsError}
          />
        </div>
      </div>
    </div>
  );
}
