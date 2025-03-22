import { useState } from "react";
import { useForm } from "react-hook-form";
import { Client, Sale, SaleItem, SaleType } from "../types";

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
    formState: { errors },
  } = useForm<SaleFormData>();
  const [items, setItems] = useState<Omit<SaleItem, "id">[]>([]);
  const saleType = watch("type");

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
      clientId: client.id,
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
    return (
      <div className="text-red-600 p-4">
        Error al procesar la venta: {error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nueva Venta</h2>
          {client && (
            <button
              type="button"
              onClick={onClearClient}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Cambiar Cliente
            </button>
          )}
        </div>
        {client && (
          <div className="mb-4">
            <p className="font-medium">Cliente: {client.name}</p>
            <p className="text-sm text-gray-600">
              Balance: RD$ {client.balance.toLocaleString()}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Venta
          </label>
          <select
            {...register("type", { required: "El tipo de venta es requerido" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione un tipo</option>
            <option value="credit">Crédito</option>
            <option value="cash">Contado</option>
            <option value="mixed">Mixta</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {saleType === "mixed" && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto en Efectivo
              </label>
              <input
                type="number"
                {...register("cashAmount", {
                  required: "El monto en efectivo es requerido",
                  min: {
                    value: 0,
                    message: "El monto debe ser mayor o igual a 0",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.cashAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cashAmount.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto a Crédito
              </label>
              <input
                type="number"
                {...register("creditAmount", {
                  required: "El monto a crédito es requerido",
                  min: {
                    value: 0,
                    message: "El monto debe ser mayor o igual a 0",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.creditAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.creditAmount.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Producto
                </label>
                <input
                  type="number"
                  {...register(`items.${index}.productId`, {
                    required: "El producto es requerido",
                    min: { value: 1, message: "Seleccione un producto válido" },
                  })}
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(index, "productId", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.items?.[index]?.productId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index].productId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, {
                    required: "La cantidad es requerida",
                    min: {
                      value: 1,
                      message: "La cantidad debe ser mayor a 0",
                    },
                  })}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.items?.[index]?.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index].quantity.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio
                </label>
                <input
                  type="number"
                  {...register(`items.${index}.price`, {
                    required: "El precio es requerido",
                    min: {
                      value: 0,
                      message: "El precio debe ser mayor o igual a 0",
                    },
                  })}
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.items?.[index]?.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index].price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ITBIS
                </label>
                <input
                  type="number"
                  {...register(`items.${index}.itbis`, {
                    required: "El ITBIS es requerido",
                    min: {
                      value: 0,
                      message: "El ITBIS debe ser mayor o igual a 0",
                    },
                  })}
                  value={item.itbis}
                  onChange={(e) =>
                    updateItem(index, "itbis", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.items?.[index]?.itbis && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.items[index].itbis.message}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          + Agregar Producto
        </button>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading || !client || items.length === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Registrar Venta"}
          </button>
        </div>
      </div>
    </form>
  );
}
