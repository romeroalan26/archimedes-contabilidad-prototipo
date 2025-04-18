import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Client, Sale, SaleItem, SaleType } from "../types";
import { useClientStore } from "../../../stores/clientStore";

interface SalesFormProps {
  client?: Client;
  onSubmit: (sale: Omit<Sale, "id">) => void;
  isLoading?: boolean;
  error?: Error | null;
  onClearClient: () => void;
}

interface SaleFormData {
  items: Omit<SaleItem, "id">[];
  type: SaleType;
  cashAmount?: number;
  creditAmount?: number;
  billingType?: string;
  ncfType?: string;
}

export default function SalesForm({
  client,
  onSubmit,
  isLoading,
  error,
  onClearClient,
}: SalesFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SaleFormData>();
  const [items, setItems] = useState<Omit<SaleItem, "id">[]>([]);
  const saleType = watch("type");
  const clients = useClientStore((state) => state.clients);

  // Actualizar los campos de facturación cuando cambia el cliente
  useEffect(() => {
    if (client) {
      setValue("billingType", client.billingType);
      setValue("ncfType", client.ncfType);
    }
  }, [client, setValue]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const itbis = items.reduce((sum, item) => sum + item.itbis, 0);

    // TODO: Implementar la lógica contable real en el backend
    /*
    Lógica contable según tipo de venta:
    
    1. Venta a Crédito:
    - Débito: Cuenta por cobrar cliente (total)
    - Crédito: Ingresos (total - itbis)
    - Crédito: Inventario (costo de los productos)
    - Crédito: Impuestos por pagar (itbis)
    
    2. Venta de Contado:
    - Débito: Caja/anticipo cliente (total)
    - Crédito: Ingresos (total - itbis)
    - Crédito: Inventario (costo de los productos)
    - Crédito: Impuestos por pagar (itbis)
    
    3. Venta Mixta:
    - Débito: Caja/anticipo cliente (cashAmount)
    - Débito: Cuenta por cobrar cliente (creditAmount)
    - Crédito: Ingresos (total - itbis)
    - Crédito: Inventario (costo de los productos)
    - Crédito: Impuestos por pagar (itbis)
    */

    onSubmit({
      clientId: parseInt(client.id),
      date: new Date(),
      total,
      status: "pending",
      items: items.map((item, index) => ({ ...item, id: index + 1 })),
      type: saleType,
      itbis,
      ...(saleType === "mixed" && {
        cashAmount: watch("cashAmount"),
        creditAmount: watch("creditAmount"),
      }),
    });
  };

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1, price: 0, itbis: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  if (error) {
    return <div className="text-red-600 p-4">Error: {error.message}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nueva Venta</h2>

      {client ? (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-600">RNC: {client.rnc}</p>
            </div>
            <button
              onClick={onClearClient}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Cambiar Cliente
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Tipo Facturación:</span>{" "}
              <span className="capitalize">{client.billingType}</span>
            </div>
            <div>
              <span className="font-medium">Tipo NCF:</span>{" "}
              <span className="capitalize">{client.ncfType}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-50 rounded text-yellow-800">
          Seleccione un cliente para continuar
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Venta
          </label>
          <select
            {...register("type")}
            className="w-full p-2 border border-gray-300 rounded"
            defaultValue="cash"
          >
            <option value="cash">Contado</option>
            <option value="credit">Crédito</option>
            <option value="mixed">Mixto</option>
          </select>
        </div>

        {saleType === "mixed" && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto en Efectivo
              </label>
              <input
                type="number"
                step="0.01"
                {...register("cashAmount", { valueAsNumber: true })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto a Crédito
              </label>
              <input
                type="number"
                step="0.01"
                {...register("creditAmount", { valueAsNumber: true })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Productos</h3>
            <button
              type="button"
              onClick={addItem}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Agregar Producto
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No hay productos agregados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>ITBIS</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-1">
                        <input
                          type="number"
                          value={item.productId}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "productId",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          value={item.itbis}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "itbis",
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full p-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={!client || isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              !client || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Procesando..." : "Crear Venta"}
          </button>
        </div>
      </form>
    </div>
  );
}
