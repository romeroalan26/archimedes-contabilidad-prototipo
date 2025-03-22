import { useState } from "react";
import { Supplier, Purchase } from "./types";
import { mockSuppliers, mockPayableStatus } from "./purchasesData";
import SupplierList from "./components/SupplierList";
import PurchasesForm from "./components/PurchasesForm";
import PayableStatusComponent from "./components/PayableStatus";

// TODO: Reemplazar con React Query cuando esté disponible
const useSuppliers = () => {
  return {
    data: mockSuppliers,
    isLoading: false,
    error: null,
  };
};

const usePayableStatus = (supplierId?: number) => {
  return {
    data: supplierId
      ? mockPayableStatus.find((s) => s.supplierId === supplierId) || null
      : null,
    isLoading: false,
    error: null,
  };
};

const useCreatePurchase = () => {
  return {
    mutate: async (purchase: Omit<Purchase, "id" | "estado">) => {
      console.log("Creando compra:", purchase);
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...purchase, id: Date.now(), estado: "pendiente" as const };
    },
    isLoading: false,
    error: null,
  };
};

export default function PurchasesPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  const {
    data: suppliers,
    isLoading: isLoadingSuppliers,
    error: suppliersError,
  } = useSuppliers();

  const {
    data: payableStatus,
    isLoading: isLoadingPayableStatus,
    error: payableStatusError,
  } = usePayableStatus(selectedSupplier?.id);

  const {
    mutate: createPurchase,
    isLoading: isCreatingPurchase,
    error: createPurchaseError,
  } = useCreatePurchase();

  const handleCreatePurchase = async (formData: any) => {
    const purchase = {
      supplierId: parseInt(formData.supplierId),
      fecha: new Date().toISOString().split("T")[0],
      monto: parseFloat(formData.monto),
      itbis: parseFloat(formData.itbis),
      retencionIsr: parseFloat(formData.retencionIsr),
      fechaVencimiento: formData.fechaVencimiento,
    };

    try {
      await createPurchase(purchase);
      // TODO: Actualizar la lista de compras y el estado de cuenta
    } catch (error) {
      console.error("Error al crear la compra:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Compras</h1>
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
    </div>
  );
}
