import { useState } from "react";
import { Client, Sale, SaleItem, SaleType } from "./types";
import { mockAccountStatements } from "./salesData";
import { salesService } from "./services/salesService";
import { ClientList } from "./components/ClientList";
import { SalesForm } from "./components/SalesForm";
import AccountStatementComponent from "./components/AccountStatement";
import { useClientStore } from "../../stores/clientStore";
import { useSalesStore } from "../../stores/salesStore";

// TODO: Replace with React Query
const useAccountStatements = (clientId?: string) => {
  // Simulación de datos - Reemplazar con React Query
  return {
    data: mockAccountStatements.filter((s) => s.clientId === clientId),
    isLoading: false,
    error: null,
  };
};

// TODO: Replace with React Query
const useCreateSale = () => {
  // Simulación de mutación - Reemplazar con React Query
  return {
    mutate: async (sale: Omit<Sale, "id">) => {
      // Simulación de creación - Reemplazar con llamada a API
      console.log("Creando venta:", sale);
      return Promise.resolve({ id: crypto.randomUUID(), ...sale });
    },
    isLoading: false,
    error: null,
  };
};

// TODO: Replace with React Query
const useSalesList = () => {
  // Simulación de datos - Reemplazar con React Query
  return {
    data: [],
    isLoading: false,
    error: null,
  };
};

export function SalesPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const clients = useClientStore((state) => state.clients);
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
  const {
    data: sales,
    isLoading: isLoadingSales,
    error: salesError,
  } = useSalesList();
  const addSale = useSalesStore(
    (state: { addSale: (sale: Omit<Sale, "id">) => void }) => state.addSale
  );

  const handleCreateSale = async (data: {
    clientId: string;
    items: SaleItem[];
    type: SaleType;
    cashAmount?: number;
    creditAmount?: number;
  }) => {
    const sale: Omit<Sale, "id"> = {
      ...data,
      date: new Date(),
      total: data.items.reduce(
        (sum, item) => sum + item.quantity * item.price + item.itbis,
        0
      ),
      status: "pending",
      itbis: data.items.reduce((sum, item) => sum + item.itbis, 0),
    };

    addSale(sale);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Ventas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ClientList
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
          />
        </div>
        <div>
          <SalesForm
            selectedClient={selectedClient}
            onSubmit={handleCreateSale}
          />
        </div>
      </div>
    </div>
  );
}
