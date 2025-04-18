import { useEffect, useState } from "react";
import { Client } from "../../../types/types";
import { SaleItem, SaleType } from "../types";
import { useProductStore } from "../../../stores/productStore";

interface SalesFormProps {
  selectedClient: Client | null;
  onSubmit: (data: {
    clientId: string;
    items: SaleItem[];
    type: SaleType;
    cashAmount?: number;
    creditAmount?: number;
  }) => void;
}

export function SalesForm({ selectedClient, onSubmit }: SalesFormProps) {
  const products = useProductStore((state) => state.products);
  const [items, setItems] = useState<
    Array<{
      productId: number;
      quantity: number;
      price: number;
      itbis: number;
    }>
  >([]);
  const [saleType, setSaleType] = useState<SaleType>("cash");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [creditAmount, setCreditAmount] = useState<number>(0);

  useEffect(() => {
    if (!selectedClient) {
      setItems([]);
      setSaleType("cash");
      setCashAmount(0);
      setCreditAmount(0);
    }
  }, [selectedClient]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: 0,
        quantity: 1,
        price: 0,
        itbis: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: number
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    onSubmit({
      clientId: selectedClient.id,
      items: items.map((item) => ({ ...item, id: crypto.randomUUID() })),
      type: saleType,
      ...(saleType === "mixed"
        ? { cashAmount, creditAmount }
        : saleType === "cash"
          ? { cashAmount: calculateTotal() }
          : { creditAmount: calculateTotal() }),
    });
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      return acc + item.quantity * item.price + item.itbis;
    }, 0);
  };

  if (!selectedClient) {
    return (
      <div className="text-center py-8 text-gray-500">
        Seleccione un cliente para comenzar
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Detalles de la venta
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de venta
          </label>
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value as SaleType)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="cash">Contado</option>
            <option value="credit">Crédito</option>
            <option value="mixed">Mixta</option>
          </select>
        </div>

        {saleType === "mixed" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto en efectivo
              </label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Monto a crédito
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Productos</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar producto
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Producto
              </label>
              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", Number(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value={0}>Seleccione un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", Number(e.target.value))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-900"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-lg font-medium text-gray-900">
          Total: RD$ {calculateTotal().toFixed(2)}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar venta
        </button>
      </div>
    </form>
  );
}
