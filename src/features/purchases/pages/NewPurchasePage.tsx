import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Supplier, Account } from "../types";
import { useCreatePurchase } from "../hooks/usePurchases";
import PurchasesForm from "../components/PurchasesForm";
import { mockSuppliers } from "../purchasesData";
import { mockProducts as inventoryProducts } from "../../inventory/mockData";

// Adaptar productos de inventario al formato de compras
const mockProducts = inventoryProducts.map((product) => ({
  id: product.id,
  codigo: product.codigo,
  nombre: product.nombre,
  precio: product.precioCompra, // Usar precio de compra para el módulo de compras
  stock: product.stock,
  unidad: product.unidad,
}));

// Mock accounts data
const mockAccounts: Account[] = [
  {
    id: 1,
    codigo: "2.1.1",
    nombre: "Cuentas por Pagar a Proveedores",
    tipo: "pasivo",
    saldo: 15000,
  },
  {
    id: 2,
    codigo: "2.1.2",
    nombre: "Cuentas por Pagar Tarjeta de Crédito",
    tipo: "pasivo",
    saldo: 5000,
  },
  {
    id: 3,
    codigo: "1.1.1",
    nombre: "Caja Chica",
    tipo: "activo",
    saldo: 10000,
  },
  {
    id: 4,
    codigo: "5.1",
    nombre: "Costos de Inventario",
    tipo: "egreso",
    saldo: 0,
  },
  {
    id: 5,
    codigo: "6.1",
    nombre: "Gastos de Oficina",
    tipo: "egreso",
    saldo: 0,
  },
];

// TODO: Replace with actual API calls
const useSuppliers = () => {
  return {
    data: mockSuppliers,
    isLoading: false,
    error: null,
  };
};

const useProducts = () => {
  return {
    data: mockProducts,
    isLoading: false,
    error: null,
  };
};

const useAccounts = () => {
  return {
    data: mockAccounts,
    isLoading: false,
    error: null,
  };
};

export default function NewPurchasePage() {
  const navigate = useNavigate();
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();

  const handleClearSupplier = () => {
    setSelectedSupplier(undefined);
  };

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
    mutate: createPurchase,
    isPending: isCreatingPurchase,
    error: createPurchaseError,
  } = useCreatePurchase();

  const handleSubmit = async (formData: any) => {
    const purchase = {
      supplierId: formData.supplierId,
      fecha: formData.fecha,
      monto: formData.monto,
      itbis: formData.itbis,
      retencionIsr: formData.retencionIsr,
      retencionItbisPercentage: formData.retencionItbisPercentage,
      fechaVencimiento: formData.fechaVencimiento,
      tipoCuentaPagar: formData.tipoCuentaPagar,
      cuentaGastoId: formData.cuentaGastoId,
      cuentaPagarId: formData.cuentaPagarId,
      items: formData.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        subtotal: parseInt(item.quantity) * parseFloat(item.price),
      })),
    };

    try {
      await createPurchase(purchase);
      navigate("/compras");
    } catch (error) {
      console.error("Error al crear la compra:", error);
    }
  };

  if (isLoadingSuppliers || isLoadingProducts || isLoadingAccounts) {
    return <div>Cargando...</div>;
  }

  if (suppliersError || productsError || accountsError) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Compra</h1>
        <button
          onClick={() => navigate("/compras")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Volver
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <PurchasesForm
          suppliers={suppliers || []}
          products={products || []}
          accounts={accounts || []}
          selectedSupplier={selectedSupplier}
          onSubmit={handleSubmit}
          isLoading={isCreatingPurchase}
          error={createPurchaseError}
          onClearSupplier={handleClearSupplier}
        />
      </div>
    </div>
  );
}
