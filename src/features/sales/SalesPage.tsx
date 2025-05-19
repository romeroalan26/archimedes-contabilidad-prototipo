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
  const [successData, setSuccessData] = useState<{
    total: number;
    client: string;
  }>({ total: 0, client: "" });
  const [processingPayment, setProcessingPayment] = useState(false);

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

    setProcessingPayment(true);

    try {
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

      // Update inventory stock
      for (const item of data.items) {
        await updateProduct(item.productId, {
          stock: (await getProductById(item.productId))!.stock - item.quantity,
        });
      }

      addSale(sale);

      // Obtener nombre del cliente para mostrar en mensaje de éxito
      const clientName = selectedClient?.name || "Cliente seleccionado";

      // Configurar datos para mensaje de éxito
      setSuccessData({
        total: sale.total,
        client: clientName,
      });

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);

      // Resetear selección de cliente solo si la venta es exitosa
      setSelectedClient(null);
    } catch (error) {
      console.error("Error al crear la venta:", error);
      alert(
        "Ocurrió un error al procesar la venta. Por favor intente nuevamente."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Pantalla de carga al procesar el pago */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Procesando su venta
            </h3>
            <p className="text-gray-500 text-center">
              Por favor espere mientras completamos la transacción...
            </p>
          </div>
        </div>
      )}

      {/* Notificación de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 w-96 bg-white border-l-4 border-green-500 text-gray-800 p-4 rounded shadow-lg z-50 animate-slide-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg
                className="h-6 w-6 text-green-500 mt-0.5"
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
              <h3 className="font-medium text-gray-900">
                ¡Venta realizada exitosamente!
              </h3>
              <div className="mt-1 text-sm text-gray-600">
                <p>
                  Cliente:{" "}
                  <span className="font-medium">{successData.client}</span>
                </p>
                <p>
                  Monto:{" "}
                  <span className="font-medium">
                    ${successData.total.toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setActiveTab("history")}
                >
                  Ver historial
                </button>
                <button
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                  onClick={() => setShowSuccessMessage(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado con tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Módulo de Ventas
            </h1>
            <div className="hidden sm:flex space-x-1">
              <button
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "new"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Nueva Venta
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Historial de Ventas
              </button>
            </div>

            {/* Menú móvil */}
            <div className="sm:hidden">
              <select
                value={activeTab}
                onChange={(e) =>
                  setActiveTab(e.target.value as "new" | "history")
                }
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="new">Nueva Venta</option>
                <option value="history">Historial de Ventas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "new" ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
            {/* Panel de clientes */}
            <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-base font-medium text-gray-900">
                    Seleccionar Cliente
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Elija un cliente para proceder con la venta
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ClientList
                    selectedClient={selectedClient}
                    onSelectClient={setSelectedClient}
                  />
                </div>
              </div>
            </div>

            {/* Panel de venta */}
            <div className="lg:col-span-8 h-full overflow-hidden flex flex-col">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-base font-medium text-gray-900">
                    Detalles de la Venta
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete los detalles para registrar la venta
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <SalesForm
                    selectedClient={selectedClient}
                    onSubmit={handleCreateSale}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-base font-medium text-gray-900">
                  Historial de Ventas
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Consulte y gestione todas las ventas realizadas
                </p>
              </div>
              <div>
                <SalesHistory
                  sales={sales || []}
                  isLoading={isLoadingSales}
                  error={salesError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
