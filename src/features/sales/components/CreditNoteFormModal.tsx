import React, { useState, useEffect } from "react";
import {
  CreditNoteFormData,
  CreditNoteType,
  CreditNoteItem,
  CREDIT_NOTE_TYPE_LABELS,
  Sale,
  Client,
} from "../types";
import { useCreditNoteActions } from "../hooks/useCreditNotes";
import { useProducts } from "../../inventory/hooks";
import { clientService } from "../../../services/clients/clientService";

interface CreditNoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (creditNote: any) => void;
  selectedSale?: Sale | null; // Pre-fill from a specific sale
}

export function CreditNoteFormModal({
  isOpen,
  onClose,
  onSuccess,
  selectedSale,
}: CreditNoteFormModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const { data: products = [] } = useProducts();
  const { createCreditNote, loading, error, clearError } =
    useCreditNoteActions();

  const [formData, setFormData] = useState<CreditNoteFormData>({
    clientId: selectedSale?.clientId || "",
    facturaOriginalId: selectedSale?.id || undefined,
    tipo: "devolucion",
    motivo: "",
    items: [],
    observaciones: "",
  });

  const [currentItem, setCurrentItem] = useState<Omit<CreditNoteItem, "id">>({
    productId: 0,
    productName: "",
    quantity: 1,
    unitPrice: 0,
    subtotal: 0,
    itbis: 0,
    total: 0,
    reason: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load clients on mount
  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  // Load sales when client is selected
  useEffect(() => {
    if (formData.clientId && !selectedSale) {
      loadSalesByClient();
    }
  }, [formData.clientId, selectedSale]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      const clientsData = await clientService.getActive();
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const loadSalesByClient = async () => {
    try {
      // TODO: Implement salesService.getByClient when available
      // For now, we'll keep it empty
      setSales([]);
    } catch (error) {
      console.error("Error loading sales:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: selectedSale?.clientId || "",
      facturaOriginalId: selectedSale?.id || undefined,
      tipo: "devolucion",
      motivo: "",
      items: [],
      observaciones: "",
    });
    setCurrentItem({
      productId: 0,
      productName: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      itbis: 0,
      total: 0,
      reason: "",
    });
    setErrors({});
    clearError();
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.clientId) {
      newErrors.clientId = "Debe seleccionar un cliente";
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = "El motivo es obligatorio";
    }

    if (formData.items.length === 0) {
      newErrors.items = "Debe agregar al menos un producto";
    }

    // Validate that total amount is greater than 0
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
    if (totalAmount <= 0) {
      newErrors.totalAmount = "El monto total debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateItemTotals = (quantity: number, unitPrice: number) => {
    const subtotal = quantity * unitPrice;
    const itbis = subtotal * 0.18; // 18% ITBIS
    const total = subtotal + itbis;
    return { subtotal, itbis, total };
  };

  const handleCurrentItemChange = (
    field: keyof typeof currentItem,
    value: any
  ) => {
    setCurrentItem((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate when quantity or price changes
      if (field === "quantity" || field === "unitPrice") {
        const { subtotal, itbis, total } = calculateItemTotals(
          field === "quantity" ? value : updated.quantity,
          field === "unitPrice" ? value : updated.unitPrice
        );
        updated.subtotal = subtotal;
        updated.itbis = itbis;
        updated.total = total;
      }

      // Auto-fill product name when product is selected
      if (field === "productId" && value > 0) {
        const product = products.find((p: any) => p.id === value);
        if (product) {
          updated.productName = product.nombre;
          updated.unitPrice = product.precioVenta;
          const { subtotal, itbis, total } = calculateItemTotals(
            updated.quantity,
            product.precioVenta
          );
          updated.subtotal = subtotal;
          updated.itbis = itbis;
          updated.total = total;
        }
      }

      return updated;
    });
  };

  const addItem = () => {
    if (currentItem.productId === 0) {
      alert("Debe seleccionar un producto");
      return;
    }

    if (currentItem.quantity <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    if (currentItem.unitPrice <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, currentItem],
    }));

    // Reset current item
    setCurrentItem({
      productId: 0,
      productName: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      itbis: 0,
      total: 0,
      reason: "",
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await createCreditNote(formData);

    if (result) {
      onSuccess?.(result);
      onClose();
    }
  };

  const getTotalAmount = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Nueva Nota de Crédito
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      clientId: e.target.value,
                    }))
                  }
                  disabled={!!selectedSale || loadingClients}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingClients
                      ? "Cargando clientes..."
                      : "Seleccionar cliente"}
                  </option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                {errors.clientId && (
                  <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factura Original
                </label>
                <select
                  value={formData.facturaOriginalId || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facturaOriginalId: e.target.value || undefined,
                    }))
                  }
                  disabled={!!selectedSale}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">Seleccionar factura (opcional)</option>
                  {sales.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      {sale.id} - ${sale.total.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Nota de Crédito *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipo: e.target.value as CreditNoteType,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(CREDIT_NOTE_TYPE_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo *
                </label>
                <textarea
                  value={formData.motivo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, motivo: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describa el motivo de la nota de crédito..."
                />
                {errors.motivo && (
                  <p className="text-red-500 text-xs mt-1">{errors.motivo}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={formData.observaciones || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observaciones: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Resumen
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Productos:</span>
                    <span>{formData.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {formData.items
                        .reduce((sum, item) => sum + item.subtotal, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITBIS:</span>
                    <span>
                      $
                      {formData.items
                        .reduce((sum, item) => sum + item.itbis, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total:</span>
                    <span>${getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Items Section */}
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Productos
            </h4>

            {/* Add Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">
                Agregar Producto
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Producto
                  </label>
                  <select
                    value={currentItem.productId}
                    onChange={(e) =>
                      handleCurrentItemChange(
                        "productId",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={0}>Seleccionar</option>
                    {products.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={currentItem.quantity}
                    onChange={(e) =>
                      handleCurrentItemChange(
                        "quantity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Precio Unit.
                  </label>
                  <input
                    type="number"
                    value={currentItem.unitPrice}
                    onChange={(e) =>
                      handleCurrentItemChange(
                        "unitPrice",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={`$${currentItem.total.toFixed(2)}`}
                    readOnly
                    className="w-full px-2 py-1 text-sm border rounded bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Razón
                  </label>
                  <input
                    type="text"
                    value={currentItem.reason || ""}
                    onChange={(e) =>
                      handleCurrentItemChange("reason", e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    &nbsp;
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="w-full px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {formData.items.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Producto
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Cantidad
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        ITBIS
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.productName}
                          {item.reason && (
                            <div className="text-xs text-gray-500">
                              {item.reason}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ${item.itbis.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm">
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

            {errors.items && (
              <p className="text-red-500 text-sm mt-2">{errors.items}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear Nota de Crédito"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
