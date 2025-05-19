import { useState } from "react";
import { Client } from "../../types/types";
import { Sale, SaleItem, SaleType } from "./types";
import { useSalesStore } from "../../stores/salesStore";
import { ClientList } from "./components/ClientList";
import { SalesForm } from "./components/SalesForm";
import { SalesHistory } from "./components/SalesHistory";
import { useSalesList } from "./hooks/useSalesList";
import { updateProduct, getProductById } from "../inventory/services";

export function SalesPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    advancePayment?: number;
    remainingBalance?: number;
  }) => {
    // Verificar que haya productos seleccionados
    if (!data.items || data.items.length === 0) {
      return; // No mostrar mensaje si no hay productos
    }

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
      advancePayment: data.advancePayment || 0,
      remainingBalance: data.remainingBalance || 0,
      payments: [],
      totalPaid: data.advancePayment || 0,
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
        return;
      }
    }

    console.log("Adding sale to store");
    addSale(sale);
    console.log("Sale added to store");

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="h-full flex flex-col">
      {showSuccessMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-96 bg-white border-l-4 border-green-500 text-gray-800 p-4 rounded shadow-lg z-50 flex items-center animate-slide-in">
          <div className="flex-shrink-0 mr-3">
            <svg
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">Venta creada exitosamente</p>
            <p className="text-sm text-gray-500">
              La venta ha sido registrada en el sistema
            </p>
          </div>
        </div>
      )}

      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "new"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Nueva Venta
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Historial
            </button>
          </div>
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
