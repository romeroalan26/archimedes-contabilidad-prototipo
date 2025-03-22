import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Supplier, Purchase, Product, Account } from "./types";
import { usePurchases, useCreatePurchase } from "./hooks/usePurchases";
import SupplierList from "./components/SupplierList";
import PurchasesForm from "./components/PurchasesForm";
import PayableStatusComponent from "./components/PayableStatus";
import { formatPurchaseStatus } from "./utils/formatters";

// TODO: Replace with actual API calls
const useSuppliers = () => {
  return {
    data: [] as Supplier[],
    isLoading: false,
    error: null,
  };
};

const useProducts = () => {
  return {
    data: [] as Product[],
    isLoading: false,
    error: null,
  };
};

const useAccounts = () => {
  return {
    data: [] as Account[],
    isLoading: false,
    error: null,
  };
};

const usePayableStatus = () => {
  return {
    data: null,
    isLoading: false,
    error: null,
  };
};

export default function PurchasesPage() {
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  const {
    data: purchases,
    isLoading: isLoadingPurchases,
    error: purchasesError,
  } = usePurchases();

  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    error: suppliersError,
  } = useSuppliers();

  const {
    data: products,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useAccounts();

  const {
    data: payableStatus,
    isLoading: isLoadingPayableStatus,
    error: payableStatusError,
  } = usePayableStatus();

  const {
    mutate: createPurchase,
    isPending: isCreatingPurchase,
    error: createPurchaseError,
  } = useCreatePurchase();

  const handleCreatePurchase = async (formData: any) => {
    const purchase = {
      supplierId: formData.supplierId.toString(),
      fecha: new Date().toISOString().split("T")[0],
      monto: formData.monto.toString(),
      itbis: formData.itbis.toString(),
      retencionIsr: formData.retencionIsr.toString(),
      fechaVencimiento: formData.fechaVencimiento,
      tipoCuentaPagar: formData.tipoCuentaPagar,
      cuentaGastoId: formData.cuentaGastoId.toString(),
      cuentaPagarId: formData.cuentaPagarId.toString(),
      items: formData.items.map((item: any) => ({
        productId: item.productId.toString(),
        quantity: item.quantity.toString(),
        price: item.price.toString(),
      })),
    };

    try {
      await createPurchase(purchase);
      // TODO: Actualizar la lista de compras y el estado de cuenta
    } catch (error) {
      console.error("Error al crear la compra:", error);
    }
  };

  if (
    isLoadingPurchases ||
    isLoadingSuppliers ||
    isLoadingProducts ||
    isLoadingAccounts
  ) {
    return <div>Cargando...</div>;
  }

  if (purchasesError || suppliersError || productsError || accountsError) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Compras</h1>
        <button
          onClick={() => navigate("/compras/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Compra
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SupplierList
            suppliers={suppliers || []}
            onSelectSupplier={setSelectedSupplier}
            isLoading={isLoadingSuppliers}
            error={suppliersError}
          />
          <PurchasesForm
            suppliers={suppliers || []}
            products={products || []}
            accounts={accounts || []}
            selectedSupplier={selectedSupplier}
            onSubmit={handleCreatePurchase}
            isLoading={isCreatingPurchase}
            error={createPurchaseError}
            onClearSupplier={() => setSelectedSupplier(undefined)}
          />
        </div>
        <div>
          <PayableStatusComponent
            payableStatus={payableStatus}
            isLoading={isLoadingPayableStatus}
            error={payableStatusError}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Lista de Compras</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases?.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {purchase.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(purchase.fecha).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {
                      suppliers?.find((s) => s.id === purchase.supplierId)
                        ?.nombre
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${purchase.monto.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        purchase.estado === "PAID"
                          ? "bg-green-100 text-green-800"
                          : purchase.estado === "OVERDUE"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {formatPurchaseStatus(purchase.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/purchases/${purchase.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
