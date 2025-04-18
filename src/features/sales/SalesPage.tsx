import { useState } from "react";
import { Client } from "../../types/types";
import { Sale, SaleItem, SaleType } from "./types";
import { useClientStore } from "../../stores/clientStore";
import { useSalesStore } from "../../stores/salesStore";
import { ClientList } from "./components/ClientList";
import { SalesForm } from "./components/SalesForm";
import { SalesHistory } from "./components/SalesHistory";
import { useAccountStatements } from "../../hooks/useAccountStatements";
import { useCreateSale } from "./hooks/useCreateSale";
import { useSalesList } from "./hooks/useSalesList";
import { updateProduct, getProductById } from "../inventory/services";

export function SalesPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
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
    console.log("handleCreateSale called with data:", data);
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

    console.log("Created sale object:", sale);

    // Update inventory stock
    for (const item of data.items) {
      try {
        await updateProduct(item.productId, {
          stock: (await getProductById(item.productId))!.stock - item.quantity,
        });
      } catch (error) {
        console.error("Error updating product stock:", error);
        // You might want to show an error message to the user here
        return;
      }
    }

    console.log("Adding sale to store");
    addSale(sale);
    console.log("Sale added to store");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "new"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nueva Venta
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeTab === "history"
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Historial
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        {activeTab === "new" ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 h-full overflow-hidden flex flex-col">
              <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium text-gray-800">
                    Clientes
                  </h2>
                </div>
                <div className="flex-1 overflow-auto p-2">
                  <ClientList
                    selectedClient={selectedClient}
                    onSelectClient={setSelectedClient}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 h-full overflow-auto">
              <SalesForm
                selectedClient={selectedClient}
                onSubmit={handleCreateSale}
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <SalesHistory
              sales={sales || []}
              isLoading={isLoadingSales}
              error={salesError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
