import { useState } from "react";
import { Client } from "../../types/types";
import { Sale, SaleItem, SaleType } from "./types";
import { useSalesStore } from "../../stores/salesStore";
import { useAuth } from "../../stores/authStore";
import { ClientList } from "./components/ClientList";
import { SalesForm } from "./components/SalesForm";
import { SalesHistory } from "./components/SalesHistory";
import { CreditNoteFormModal } from "./components/CreditNoteFormModal";
import { useSalesList } from "./hooks/useSalesList";
import { updateProduct, getProductById } from "../inventory/services";

export function SalesPage() {
  const {
    /* user */
  } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<
    "new" | "history" | "credit-notes"
  >("new");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successData, setSuccessData] = useState<{
    total: number;
    client: string;
  }>({ total: 0, client: "" });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [selectedSaleForCredit, setSelectedSaleForCredit] =
    useState<Sale | null>(null);

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

  const handleCreateCreditNote = (sale?: Sale) => {
    setSelectedSaleForCredit(sale || null);
    setShowCreditNoteModal(true);
  };

  const handleCreditNoteSuccess = () => {
    setShowCreditNoteModal(false);
    setSelectedSaleForCredit(null);
    // Optionally refresh sales data
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Pantalla de carga al procesar el pago */}
      {processingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              Procesando su venta
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Por favor espere mientras completamos la transacción...
            </p>
          </div>
        </div>
      )}

      {/* Notificación de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 w-96 bg-white dark:bg-gray-800 border-l-4 border-green-500 text-gray-800 dark:text-gray-200 p-4 rounded shadow-lg z-50 animate-slide-in-right border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg
                className="h-6 w-6 text-green-500 dark:text-green-400 mt-0.5"
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
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                ¡Venta realizada exitosamente!
              </h3>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
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
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                  onClick={() => setActiveTab("history")}
                >
                  Ver historial
                </button>
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Módulo de Ventas
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestiona tus ventas, clientes y notas de crédito en un solo
                lugar
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="hidden sm:flex space-x-1">
                <button
                  onClick={() => setActiveTab("new")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "new"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Nueva Venta
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "history"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Historial de Ventas
                </button>
                <button
                  onClick={() => setActiveTab("credit-notes")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "credit-notes"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Notas de Crédito
                </button>
              </div>

              {/* Menú móvil */}
              <div className="sm:hidden mt-4">
                <select
                  value={activeTab}
                  onChange={(e) =>
                    setActiveTab(
                      e.target.value as "new" | "history" | "credit-notes"
                    )
                  }
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 sm:text-sm"
                >
                  <option value="new">Nueva Venta</option>
                  <option value="history">Historial de Ventas</option>
                  <option value="credit-notes">Notas de Crédito</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "new" ? (
          <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-4 p-4">
            {/* Panel de clientes - Más ancho para mejor usabilidad */}
            <div className="xl:col-span-4 h-full overflow-hidden flex flex-col">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Seleccionar Cliente
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Busque y seleccione el cliente para la venta
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

            {/* Panel de venta - Espacio optimizado */}
            <div className="xl:col-span-8 h-full overflow-hidden flex flex-col">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full flex flex-col border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    Detalles de la Venta
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
        ) : activeTab === "history" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Historial de Ventas
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Consulte y gestione todas las ventas realizadas
                    </p>
                  </div>
                  <button
                    onClick={() => handleCreateCreditNote()}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-sm font-medium"
                  >
                    Nueva Nota de Crédito
                  </button>
                </div>
              </div>
              <div>
                <SalesHistory
                  sales={sales || []}
                  isLoading={isLoadingSales}
                  error={salesError}
                  onCreateCreditNote={handleCreateCreditNote}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                      Notas de Crédito
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Gestione las notas de crédito emitidas
                    </p>
                  </div>
                  <button
                    onClick={() => handleCreateCreditNote()}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 text-sm font-medium"
                  >
                    Nueva Nota de Crédito
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                  La funcionalidad de gestión de notas de crédito estará
                  disponible próximamente.
                  <br />
                  Por ahora puede crear notas de crédito desde el historial de
                  ventas o usando el botón "Nueva Nota de Crédito".
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Nota de Crédito */}
      <CreditNoteFormModal
        isOpen={showCreditNoteModal}
        onClose={() => setShowCreditNoteModal(false)}
        onSuccess={handleCreditNoteSuccess}
        selectedSale={selectedSaleForCredit}
      />
    </div>
  );
}
