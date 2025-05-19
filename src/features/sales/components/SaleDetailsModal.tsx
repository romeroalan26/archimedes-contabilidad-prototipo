import { useState } from "react";
import { Sale } from "../types";
import { useClientStore } from "../../../stores/clientStore";
import { generateInvoicePDF } from "./InvoicePDF";
import { SalePayments } from "./SalePayments";
import { useSalesStore } from "../../../stores/salesStore";
import { formatCurrency } from "../../../utils/formatters";
import { Product } from "../../inventory/types";
import { getProducts } from "../../inventory/services";

interface SaleDetailsModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const clients = useClientStore((state) => state.clients);
  const client = clients.find((c) => c.id === sale?.clientId);
  const updateSale = useSalesStore((state) => state.updateSale);
  const [activeTab, setActiveTab] = useState<"info" | "payments">("info");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  if (!sale) return null;

  const handlePrintInvoice = () => {
    if (client) {
      generateInvoicePDF({ sale, client });
    }
  };

  const handleUpdateSale = (updatedSale: Sale) => {
    updateSale(updatedSale);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "partial":
        return "Parcial";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getSaleTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Contado";
      case "credit":
        return "Crédito";
      case "mixed":
        return "Mixto";
      default:
        return type;
    }
  };

  const loadProductDetails = async () => {
    if (products.length > 0) return;

    setIsLoadingProducts(true);
    try {
      const productData = await getProducts();
      setProducts(productData);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.nombre : `Producto ${productId}`;
  };

  // Cargar productos cuando se abre el modal
  if (products.length === 0 && !isLoadingProducts) {
    loadProductDetails();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            Detalles de Venta
            <span className="ml-2 text-sm font-normal text-gray-500">
              #{sale.id.substring(0, 8)}
            </span>
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimir Factura
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              aria-label="Cerrar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        {/* Pestañas */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6 -mb-px">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "info"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Información General
            </button>
            {(sale.type === "credit" || sale.type === "mixed") && (
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "payments"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pagos
                {sale.payments.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {sale.payments.length}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "info" ? (
            <div className="space-y-8">
              {/* Encabezado de venta */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap justify-between items-start">
                  {/* Info del cliente */}
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Cliente
                    </h3>
                    <p className="text-base font-semibold text-gray-900">
                      {client?.name || "Cliente no encontrado"}
                    </p>
                    {client?.rnc && (
                      <p className="text-sm text-gray-600">RNC: {client.rnc}</p>
                    )}
                    {client?.address && (
                      <p className="text-sm text-gray-600">{client.address}</p>
                    )}
                  </div>

                  {/* Info de la venta */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-500 mr-2">
                        Estado:
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {getStatusLabel(sale.status)}
                      </span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="text-sm text-gray-500 mr-2">Tipo:</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getSaleTypeLabel(sale.type)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Fecha: {new Date(sale.date).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total venta */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Total
                  </h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(sale.total)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ITBIS: {formatCurrency(sale.itbis)}
                  </p>
                </div>

                {/* Pagado */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Pagado
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(sale.totalPaid)}
                  </p>
                  {sale.type !== "cash" && (
                    <p className="text-sm text-gray-500 mt-1">
                      Avance inicial: {formatCurrency(sale.advancePayment || 0)}
                    </p>
                  )}
                </div>

                {/* Pendiente (solo para credito o mixto) */}
                {(sale.type === "credit" || sale.type === "mixed") && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Pendiente
                    </h3>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(sale.remainingBalance || 0)}
                    </p>
                    {sale.type === "mixed" && (
                      <p className="text-sm text-gray-500 mt-1">
                        A crédito: {formatCurrency(sale.creditAmount || 0)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Lista de productos */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">
                  Productos
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Producto
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Cantidad
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Precio Unitario
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ITBIS
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {isLoadingProducts ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-4 text-center text-sm text-gray-500"
                            >
                              Cargando productos...
                            </td>
                          </tr>
                        ) : (
                          sale.items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {getProductName(item.productId)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {item.productId}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                {formatCurrency(item.price)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                {formatCurrency(item.itbis)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                {formatCurrency(
                                  item.quantity * item.price + item.itbis
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-3 text-right text-sm font-medium text-gray-900"
                          >
                            Total:
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(sale.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <SalePayments sale={sale} onUpdateSale={handleUpdateSale} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
