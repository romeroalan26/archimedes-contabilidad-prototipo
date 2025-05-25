import { useEffect, useState, useCallback } from "react";
import { Client } from "../../../types/types";
import { SaleItem, SaleType, PaymentMethod } from "../types";
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [showITBIS, setShowITBIS] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const inventoryProducts = await getProducts();
        setProducts(inventoryProducts);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    loadProducts();
  }, []);

  // Filtrar productos según término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  // Reset del formulario cuando cambia el cliente
  useEffect(() => {
    if (!selectedClient) {
      setItems([]);
      setSaleType("cash");
      setCashAmount(0);
      setCreditAmount(0);
      setAdvancePayment(0);
      setRemainingBalance(0);
      setPaymentMethod("efectivo");
      setReferenceNumber("");
      setFormError(null);
    }
  }, [selectedClient]);

  // Calcular balance pendiente
  useEffect(() => {
    const total = calculateTotal();
    if (saleType === "credit" || saleType === "mixed") {
      const remaining = total - advancePayment;
      setRemainingBalance(remaining >= 0 ? remaining : 0);

      // Actualizar monto de crédito automáticamente
      if (saleType === "mixed") {
        setCreditAmount(remaining >= 0 ? remaining : 0);
      }
    } else {
      setRemainingBalance(0);
    }
  }, [advancePayment, items, saleType]);

  // Validar formulario
  useEffect(() => {
    const validateForm = () => {
      if (!selectedClient) {
        setFormError("Debe seleccionar un cliente para continuar");
        setIsFormValid(false);
        return;
      }

      if (!items.length) {
        setFormError("Debe agregar al menos un producto");
        setIsFormValid(false);
        return;
      }

      const invalidItems = items.filter(
        (item) => item.productId === 0 || item.quantity <= 0
      );

      if (invalidItems.length > 0) {
        setFormError("Todos los productos deben tener cantidad válida");
        setIsFormValid(false);
        return;
      }

      const total = calculateTotal();

      if (saleType === "mixed") {
        if (cashAmount <= 0 || creditAmount <= 0) {
          setFormError(
            "En ventas mixtas, los montos de efectivo y crédito deben ser mayores que cero"
          );
          setIsFormValid(false);
          return;
        }

        if (Math.abs(cashAmount + creditAmount - total) > 0.01) {
          setFormError("La suma de efectivo y crédito debe ser igual al total");
          setIsFormValid(false);
          return;
        }
      }

      if (
        (saleType === "credit" || saleType === "mixed") &&
        advancePayment > total
      ) {
        setFormError("El avance no puede ser mayor al total");
        setIsFormValid(false);
        return;
      }

      if (
        saleType === "cash" ||
        ((saleType === "credit" || saleType === "mixed") && advancePayment > 0)
      ) {
        if (paymentMethod === "transferencia" || paymentMethod === "cheque") {
          if (!referenceNumber.trim()) {
            setFormError(
              `Debe proporcionar un número de referencia para pagos con ${paymentMethod === "transferencia" ? "transferencia" : "cheque"}`
            );
            setIsFormValid(false);
            return;
          }
        }
      }

      setFormError(null);
      setIsFormValid(true);
    };

    validateForm();
  }, [
    selectedClient,
    items,
    saleType,
    cashAmount,
    creditAmount,
    advancePayment,
    paymentMethod,
    referenceNumber,
  ]);

  // Agregar producto al carrito
  const handleAddProduct = (product: Product) => {
    // Verificar si el producto ya está en la lista
    const existingItemIndex = items.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Si el producto ya existe, incrementar cantidad
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += 1;

      // Recalcular subtotal con descuento
      updatedItems[existingItemIndex].discountedSubtotal = calculateSubtotal(
        updatedItems[existingItemIndex].quantity,
        updatedItems[existingItemIndex].price,
        updatedItems[existingItemIndex].itbis,
        updatedItems[existingItemIndex].discount
      );

      setItems(updatedItems);
    } else {
      // Si es un producto nuevo, agregarlo
      const newItem = {
        id: crypto.randomUUID(),
        productId: product.id,
        quantity: 1,
        price: product.precioVenta,
        itbis: product.precioVenta * 0.18, // 18% ITBIS
        discount: 0,
        discountedSubtotal: product.precioVenta + product.precioVenta * 0.18, // Precio + ITBIS
      };

      setItems([...items, newItem]);
    }

    // Limpiar búsqueda después de agregar
    setSearchTerm("");
    setIsProductDropdownOpen(false);
  };

  // Remover un producto
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calcular subtotal de un item con descuento
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

  // Manejar cambios en los items
  const handleItemChange = (
    index: number,
    field: keyof (typeof items)[0],
    value: number
  ) => {
    const newItems = [...items];
    const item = newItems[index];

    // Si es cambio de producto
    if (field === "productId") {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        item.price = selectedProduct.precioVenta;
        item.itbis = selectedProduct.precioVenta * 0.18; // 18% ITBIS
      }
    }

    // Si es cambio de cantidad, validar stock
    if (field === "quantity") {
      const product = products.find((p) => p.id === item.productId);
      if (product && value > product.stock) {
        alert(
          `Solo hay ${product.stock} unidades disponibles de ${product.nombre}`
        );
        value = product.stock;
      }
    }

    item[field] = value;

    // Recalcular subtotal con descuento
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

  // Calcular total de la venta
  const calculateTotal = useCallback(() => {
    return items.reduce((acc, item) => {
      return acc + item.discountedSubtotal;
    }, 0);
  }, [items]);

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || !selectedClient) return;

    const total = calculateTotal();

    // Preparar datos para enviar
    const formData = {
      clientId: selectedClient.id,
      items: items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      })),
      type: saleType,
      ...(saleType === "mixed"
        ? { cashAmount, creditAmount }
        : saleType === "cash"
          ? { cashAmount: total }
          : { creditAmount: total }),
      ...(saleType === "credit" || saleType === "mixed"
        ? {
            advancePayment,
            remainingBalance: total - advancePayment,
          }
        : {}),
    };

    onSubmit(formData);
  };

  // Si no hay cliente seleccionado
  if (!selectedClient) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            Seleccione un cliente
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Para iniciar una venta, primero debe seleccionar un cliente de la
            lista.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Cliente seleccionado */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Cliente:{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {selectedClient.name}
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              RNC: {selectedClient.rnc} •
              {selectedClient.phone && (
                <span> Tel: {selectedClient.phone} •</span>
              )}
              {selectedClient.address && (
                <span> Dir: {selectedClient.address}</span>
              )}
            </p>
          </div>
          <div className="flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                selectedClient.billingType === "contado"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : selectedClient.billingType === "credito"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
              }`}
            >
              {selectedClient.billingType === "contado"
                ? "Contado"
                : selectedClient.billingType === "credito"
                  ? "Crédito"
                  : "Mixto"}
            </span>
          </div>
        </div>
      </div>

      {/* Buscar y agregar productos */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <label
            htmlFor="product-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Buscar y agregar productos
          </label>
          <div className="relative">
            <input
              id="product-search"
              type="text"
              placeholder="Busque por nombre o código..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsProductDropdownOpen(true);
              }}
              onFocus={() => setIsProductDropdownOpen(true)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
            />
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Dropdown de productos */}
          {isProductDropdownOpen && filteredProducts.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md overflow-auto border border-gray-200 dark:border-gray-600">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${product.stock <= 0 ? "opacity-50" : ""}`}
                    onClick={() => {
                      if (product.stock > 0) {
                        handleAddProduct(product);
                      } else {
                        alert("Este producto no tiene stock disponible");
                      }
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {product.nombre}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Código: {product.codigo} • Precio: $
                          {product.precioVenta.toFixed(2)}
                        </div>
                      </div>
                      <div
                        className={`text-xs ${product.stock > 5 ? "text-green-600 dark:text-green-400" : product.stock > 0 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {product.stock > 0
                          ? `Stock: ${product.stock}`
                          : "Sin stock"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Lista de productos seleccionados */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
            <svg
              className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              No hay productos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Busque y agregue productos para comenzar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Productos seleccionados
                </h3>
                <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? "ítem" : "ítems"}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowITBIS(!showITBIS)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showITBIS ? "Ocultar ITBIS" : "Mostrar ITBIS"}
                </button>
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Limpiar todo
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Producto
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Cant.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Precio
                    </th>
                    {showITBIS && (
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        ITBIS
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Desc. %
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Subtotal
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item, index) => {
                    const selectedProduct = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {selectedProduct?.nombre ||
                              "Producto no encontrado"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedProduct?.codigo || ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            max={selectedProduct?.stock || 999}
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="block w-16 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          ${item.price.toFixed(2)}
                        </td>
                        {showITBIS && (
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            ${item.itbis.toFixed(2)}
                          </td>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={item.discount}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "discount",
                                Number(e.target.value)
                              )
                            }
                            className="block w-16 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {item.discount > 0 ? (
                              <>
                                <span className="line-through text-gray-400 dark:text-gray-500 mr-1">
                                  $
                                  {(
                                    item.quantity * item.price +
                                    item.itbis
                                  ).toFixed(2)}
                                </span>
                                <span className="text-green-600 dark:text-green-400">
                                  ${item.discountedSubtotal.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-900 dark:text-gray-100">
                                ${item.discountedSubtotal.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sección de pago */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de venta y totales */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Venta
            </h3>
            <div className="space-y-3">
              <div className="flex space-x-2">
                {["cash", "credit", "mixed"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSaleType(type as SaleType)}
                    className={`px-3 py-1.5 rounded text-sm font-medium flex-1 ${
                      saleType === type
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type === "cash"
                      ? "Contado"
                      : type === "credit"
                        ? "Crédito"
                        : "Mixta"}
                  </button>
                ))}
              </div>

              {/* Detalles específicos según tipo de venta */}
              {saleType === "mixed" && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Monto en Efectivo
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(Number(e.target.value))}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Monto a Crédito
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                    />
                  </div>
                </div>
              )}

              {(saleType === "credit" || saleType === "mixed") && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Avance / Inicial
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max={calculateTotal()}
                      value={advancePayment}
                      onChange={(e) =>
                        setAdvancePayment(Number(e.target.value))
                      }
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Saldo Pendiente
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={remainingBalance}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Método de pago */}
              {(saleType === "cash" ||
                ((saleType === "credit" || saleType === "mixed") &&
                  advancePayment > 0)) && (
                <div className="pt-2">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Método de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="cheque">Cheque</option>
                      <option value="otro">Otro</option>
                    </select>

                    {(paymentMethod === "transferencia" ||
                      paymentMethod === "cheque") && (
                      <input
                        type="text"
                        placeholder={`Nº de ${paymentMethod === "transferencia" ? "referencia" : "cheque"}`}
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Mensaje de error */}
              {formError && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {formError}
                </div>
              )}
            </div>
          </div>

          {/* Resumen y botón de venta */}
          <div className="border-t pt-4 md:border-t-0 md:pt-0">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Resumen de la Venta
            </h3>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    $
                    {items
                      .reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    ITBIS (18%):
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    $
                    {items
                      .reduce((acc, item) => acc + item.itbis, 0)
                      .toFixed(2)}
                  </span>
                </div>

                {items.some((item) => item.discount > 0) && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Descuentos:</span>
                    <span className="font-medium">
                      -$
                      {items
                        .reduce((acc, item) => {
                          const subtotal =
                            item.quantity * item.price + item.itbis;
                          const discountAmount =
                            subtotal * (item.discount / 100);
                          return acc + discountAmount;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-gray-900 dark:text-gray-100">
                      Total:
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>

                  {(saleType === "credit" || saleType === "mixed") && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Avance:</span>
                        <span>${advancePayment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600 dark:text-red-400 font-medium">
                        <span>Pendiente:</span>
                        <span>${remainingBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  disabled={!isFormValid || items.length === 0}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Finalizar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
