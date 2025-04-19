import { useEffect, useState } from "react";
import { Client } from "../../../types/types";
import { SaleItem, SaleType } from "../types";
import { Product } from "../../inventory/types";
import { getProducts } from "../../inventory/services";

interface SalesFormProps {
  selectedClient: Client | null;
  onSubmit: (data: {
    clientId: string;
    items: SaleItem[];
    type: SaleType;
    cashAmount?: number;
    creditAmount?: number;
    advancePayment?: number;
    remainingBalance?: number;
  }) => void;
}

export function SalesForm({ selectedClient, onSubmit }: SalesFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<
    Array<{
      productId: number;
      quantity: number;
      price: number;
      itbis: number;
      discount: number;
      discountedSubtotal: number;
    }>
  >([]);
  const [saleType, setSaleType] = useState<SaleType>("cash");
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);

  useEffect(() => {
    // Load inventory products
    const loadProducts = async () => {
      try {
        const inventoryProducts = await getProducts();
        setProducts(inventoryProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      setItems([]);
      setSaleType("cash");
      setCashAmount(0);
      setCreditAmount(0);
      setAdvancePayment(0);
      setRemainingBalance(0);
    }
  }, [selectedClient]);

  // Calculate remaining balance whenever advance payment or total changes
  useEffect(() => {
    const total = calculateTotal();
    if (saleType === "credit" || saleType === "mixed") {
      const remaining = total - advancePayment;
      setRemainingBalance(remaining >= 0 ? remaining : 0);
    } else {
      setRemainingBalance(0);
    }
  }, [advancePayment, items, saleType]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productId: 0,
        quantity: 1,
        price: 0,
        itbis: 0,
        discount: 0,
        discountedSubtotal: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = (
    quantity: number,
    price: number,
    itbis: number,
    discount: number
  ) => {
    const subtotal = quantity * price + itbis;
    const discountedAmount = subtotal * (discount / 100);
    return subtotal - discountedAmount;
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: number
  ) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        item.price = selectedProduct.precio;
        item.itbis = selectedProduct.precio * 0.18; // 18% ITBIS
      }
    }

    item[field] = value;

    // Recalculate discounted subtotal whenever quantity, price, itbis, or discount changes
    if (["quantity", "price", "itbis", "discount"].includes(field)) {
      item.discountedSubtotal = calculateSubtotal(
        item.quantity,
        item.price,
        item.itbis,
        item.discount
      );
    }

    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { selectedClient, items, saleType });
    if (!selectedClient) return;

    // Validate stock before submitting
    const hasInsufficientStock = items.some((item) => {
      const product = products.find((p) => p.id === item.productId);
      return !product || product.stock < item.quantity;
    });

    if (hasInsufficientStock) {
      alert("Uno o más productos no tienen suficiente stock disponible");
      return;
    }

    // Validate advance payment
    const total = calculateTotal();
    if (advancePayment > total) {
      alert("El avance no puede ser mayor al total de la venta");
      return;
    }

    const formData = {
      clientId: selectedClient.id,
      items: items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        discountedSubtotal: calculateSubtotal(
          item.quantity,
          item.price,
          item.itbis,
          item.discount
        ),
      })),
      type: saleType,
      ...(saleType === "mixed"
        ? { cashAmount, creditAmount }
        : saleType === "cash"
          ? { cashAmount: calculateTotal() }
          : { creditAmount: calculateTotal() }),
      ...(saleType === "credit" || saleType === "mixed"
        ? {
            advancePayment,
            remainingBalance: total - advancePayment,
          }
        : {}),
    };

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      return acc + item.discountedSubtotal;
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
    <form
      onSubmit={handleSubmit}
      className="h-full flex flex-col bg-white rounded-lg shadow"
    >
      <div className="flex-none p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Nueva Venta</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Tipo:</label>
              <select
                value={saleType}
                onChange={(e) => setSaleType(e.target.value as SaleType)}
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="cash">Contado</option>
                <option value="credit">Crédito</option>
                <option value="mixed">Mixta</option>
              </select>
            </div>
            {saleType === "mixed" && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Efectivo:</label>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(Number(e.target.value))}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Crédito:</label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(Number(e.target.value))}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            )}
            {(saleType === "credit" || saleType === "mixed") && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Avance:</label>
                  <input
                    type="number"
                    min="0"
                    max={calculateTotal()}
                    value={advancePayment}
                    onChange={(e) => setAdvancePayment(Number(e.target.value))}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Pendiente:</label>
                  <input
                    type="number"
                    value={remainingBalance}
                    readOnly
                    className="block w-24 rounded-md border-gray-300 shadow-sm bg-gray-50 text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">Productos</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Agregar producto
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalles
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ITBIS
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento (%)
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => {
                  const selectedProduct = products.find(
                    (p) => p.id === item.productId
                  );
                  const subtotal = item.quantity * item.price + item.itbis;
                  return (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "productId",
                              Number(e.target.value)
                            )
                          }
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        >
                          <option value={0}>Seleccione un producto</option>
                          {products
                            .filter((p) => p.stock > 0)
                            .map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.nombre} (Stock: {product.stock})
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {selectedProduct && (
                          <div className="group relative">
                            <span className="text-sm text-gray-500 cursor-help">
                              {selectedProduct.codigo} -{" "}
                              {selectedProduct.unidad}
                            </span>
                            <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <p className="font-medium">
                                {selectedProduct.nombre}
                              </p>
                              <p className="mt-1">
                                {selectedProduct.descripcion}
                              </p>
                              <p className="mt-1">
                                Código: {selectedProduct.codigo}
                              </p>
                              <p>Unidad: {selectedProduct.unidad}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.price}
                          readOnly
                          className="block w-24 rounded-md border-gray-300 shadow-sm bg-gray-50 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.itbis}
                          readOnly
                          className="block w-24 rounded-md border-gray-300 shadow-sm bg-gray-50 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "discount",
                              Number(e.target.value)
                            )
                          }
                          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-500">
                            {subtotal.toFixed(2)}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-green-600 font-medium">
                              {item.discountedSubtotal.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex-none p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <div>
              Subtotal:{" "}
              <span className="font-medium text-gray-900">
                $
                {items
                  .reduce(
                    (acc, item) =>
                      acc + (item.quantity * item.price + item.itbis),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div>
              Total con descuentos:{" "}
              <span className="font-medium text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Venta
          </button>
        </div>
      </div>
    </form>
  );
}
