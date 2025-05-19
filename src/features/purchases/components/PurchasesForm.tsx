import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import {
  Supplier,
  Product,
  Account,
  PayableType,
  
} from "../types";
import { ITBIS_RETENTION_OPTIONS } from "../config/purchasesConfig";
import { useProviderStore } from "../stores/providerStore";
import ProviderModal from "./ProviderModal";
import { useCostCenterStore } from "../stores/costCenterStore";
import CostCenterModal from "./CostCenterModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

interface PurchaseFormData {
  supplierId: string;
  monto: string;
  itbis: string;
  retencionIsr: string;
  retencionItbisPercentage: string;
  fechaVencimiento: string;
  tipoCuentaPagar: PayableType;
  cuentaGastoId: string;
  cuentaPagarId: string;
  ncf: string;
  observaciones: string;
  items: {
    productId: string;
    quantity: string;
    price: string;
    description: string;
  }[];
}

interface PurchasesFormProps {
  suppliers: Supplier[];
  products: Product[];
  accounts: Account[];
  selectedSupplier?: Supplier;
  onSubmit: (data: PurchaseFormData) => void;
  isLoading?: boolean;
  error?: Error | null;
  onClearSupplier?: () => void;
}

export default function PurchasesForm({
  suppliers,
  products,
  
  selectedSupplier,
  onSubmit,
  isLoading,
  error,
  onClearSupplier,
}: PurchasesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    control,
    setValue,
  } = useForm<PurchaseFormData>({
    defaultValues: {
      supplierId: selectedSupplier?.id.toString() || "",
      monto: "",
      itbis: "",
      retencionIsr: "",
      retencionItbisPercentage: "0",
      fechaVencimiento: "",
      tipoCuentaPagar: "SUPPLIER",
      cuentaGastoId: "",
      cuentaPagarId: "",
      ncf: "",
      observaciones: "",
      items: [{ productId: "", quantity: "", price: "", description: "" }],
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    control,
    name: "items",
  });

  // Observar cambios en los items para calcular el subtotal
  const items = watch("items");
  const retencionItbisPercentage = watch("retencionItbisPercentage");

  // Calcular subtotal basado en los items
  const subtotal = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity || "0");
    const price = parseFloat(item.price || "0");
    return acc + quantity * price;
  }, 0);

  // Calcular ITBIS (18% del subtotal)
  const itbisCalculado = subtotal * 0.18;

  // Calcular retención de ITBIS/ISR
  const retencionCalculada =
    (itbisCalculado * parseFloat(retencionItbisPercentage || "0")) / 100;

  // Actualizar los valores en el formulario cuando cambian los cálculos
  useEffect(() => {
    setValue("monto", subtotal.toFixed(2));
    setValue("itbis", itbisCalculado.toFixed(2));
    setValue("retencionIsr", retencionCalculada.toFixed(2));
  }, [subtotal, itbisCalculado, retencionCalculada, setValue]);

  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const { providers } = useProviderStore();
  const { costCenters } = useCostCenterStore();

  // Create a map to track unique suppliers by ID
  const suppliersMap = new Map();
  suppliers.forEach((supplier) => suppliersMap.set(supplier.id, supplier));
  providers.forEach((provider) => suppliersMap.set(provider.id, provider));
  const allSuppliers = Array.from(suppliersMap.values());

  const [isProviderComboboxOpen, setIsProviderComboboxOpen] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const providerComboboxRef = useRef<HTMLDivElement>(null);
  const [isCostCenterComboboxOpen, setIsCostCenterComboboxOpen] =
    useState(false);
  const [costCenterSearch, setCostCenterSearch] = useState("");
  const costCenterComboboxRef = useRef<HTMLDivElement>(null);

  // Add effect to update form when supplier is selected
  useEffect(() => {
    if (selectedSupplier) {
      setValue("supplierId", selectedSupplier.id.toString());
      setProviderSearch(selectedSupplier.nombre);
      setIsProviderComboboxOpen(false);
    } else {
      setValue("supplierId", "");
      setProviderSearch("");
    }
  }, [selectedSupplier, setValue]);

  const filteredSuppliers = allSuppliers.filter((supplier) =>
    supplier.nombre.toLowerCase().includes(providerSearch.toLowerCase())
  );

  const filteredCostCenters = costCenters.filter((costCenter) =>
    `${costCenter.codigo} ${costCenter.nombre}`
      .toLowerCase()
      .includes(costCenterSearch.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        providerComboboxRef.current &&
        !providerComboboxRef.current.contains(event.target as Node)
      ) {
        setIsProviderComboboxOpen(false);
      }
      if (
        costCenterComboboxRef.current &&
        !costCenterComboboxRef.current.contains(event.target as Node)
      ) {
        setIsCostCenterComboboxOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onFormSubmit = (data: PurchaseFormData) => {
    // TODO: Implementar lógica contable
    /*
    1. Débito:
       - Si es gasto: cuentaGastoId
       - Si es inventario: cuenta de inventario correspondiente al producto
    
    2. Crédito:
       - Si es suplidor: cuenta por pagar a suplidor
       - Si es tarjeta: cuenta por pagar tarjeta de crédito
       - Si es caja chica: cuenta de caja chica
    
    3. Enlace con inventario:
       - Actualizar stock de productos
       - Registrar costo de adquisición
    */
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Registrar Factura de Proveedor
      </h3>
      {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <Accordion
          type="single"
          collapsible
          defaultValue="datos-generales"
          className="w-full"
        >
          {/* Datos Generales */}
          <AccordionItem value="datos-generales">
            <AccordionTrigger className="text-lg font-medium">
              Datos Generales
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Proveedor
                  </label>
                  <div className="mt-1 relative" ref={providerComboboxRef}>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={providerSearch}
                          onChange={(e) => {
                            setProviderSearch(e.target.value);
                            setIsProviderComboboxOpen(true);
                          }}
                          onFocus={() => setIsProviderComboboxOpen(true)}
                          placeholder="Buscar proveedor..."
                          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            errors.supplierId ? "border-red-500" : ""
                          }`}
                        />
                        {isProviderComboboxOpen &&
                          filteredSuppliers.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                              {filteredSuppliers.map((supplier) => (
                                <div
                                  key={supplier.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                  onClick={() => {
                                    setValue(
                                      "supplierId",
                                      supplier.id.toString()
                                    );
                                    setProviderSearch(supplier.nombre);
                                    setIsProviderComboboxOpen(false);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="font-medium block truncate">
                                      {supplier.nombre}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    RNC: {supplier.rnc}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      {selectedSupplier && onClearSupplier && (
                        <button
                          type="button"
                          onClick={onClearSupplier}
                          className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsProviderModalOpen(true)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        +
                      </button>
                    </div>
                    {errors.supplierId && (
                      <p className="text-red-600 text-sm mt-1">
                        El proveedor es requerido
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    {...register("fechaVencimiento")}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo de Compra
                  </label>
                  <select
                    {...register("tipoCuentaPagar")}
                    className="mt-1 block w-full p-2 border rounded-md"
                  >
                    <option value="SUPPLIER">Suplidor</option>
                    <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                    <option value="PETTY_CASH">Caja Chica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    NCF
                  </label>
                  <input
                    type="text"
                    {...register("ncf")}
                    className="mt-1 block w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Detalle de Productos */}
          <AccordionItem value="detalle-productos">
            <AccordionTrigger className="text-lg font-medium">
              Detalle de Productos
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Producto
                      </label>
                      <select
                        {...register(`items.${index}.productId` as const, {
                          required: "Seleccione un producto",
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccione un producto</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <input
                        type="text"
                        {...register(`items.${index}.description` as const)}
                        placeholder="Descripción del item"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        step="1"
                        {...register(`items.${index}.quantity` as const, {
                          required: "La cantidad es requerida",
                          min: {
                            value: 1,
                            message: "La cantidad debe ser mayor a 0",
                          },
                        })}
                        className="w-24 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Precio
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.price` as const, {
                            required: "El precio es requerido",
                            min: {
                              value: 0.01,
                              message: "El precio debe ser mayor a 0",
                            },
                          })}
                          className="w-32 pl-7 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    append({
                      productId: "",
                      quantity: "",
                      price: "",
                      description: "",
                    })
                  }
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Agregar Producto
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Retenciones y Centros de Costo */}
          <AccordionItem value="retenciones-costos">
            <AccordionTrigger className="text-lg font-medium">
              Retenciones y Centros de Costo
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retención ITBIS
                  </label>
                  <select
                    {...register("retencionItbisPercentage")}
                    className="mt-1 block w-full p-2 border rounded-md"
                  >
                    {ITBIS_RETENTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Retención ISR
                  </label>
                  <input
                    type="text"
                    {...register("retencionIsr")}
                    className="mt-1 block w-full p-2 border rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Centro de Costo
                  </label>
                  <div className="mt-1 relative" ref={costCenterComboboxRef}>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          value={costCenterSearch}
                          onChange={(e) => {
                            setCostCenterSearch(e.target.value);
                            setIsCostCenterComboboxOpen(true);
                          }}
                          onFocus={() => setIsCostCenterComboboxOpen(true)}
                          placeholder="Buscar centro de costo..."
                          className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            errors.cuentaGastoId ? "border-red-500" : ""
                          }`}
                        />
                        {isCostCenterComboboxOpen &&
                          filteredCostCenters.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                              {filteredCostCenters.map((costCenter) => (
                                <div
                                  key={costCenter.id}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                  onClick={() => {
                                    setValue(
                                      "cuentaGastoId",
                                      costCenter.id.toString()
                                    );
                                    setCostCenterSearch(
                                      `${costCenter.codigo} - ${costCenter.nombre}`
                                    );
                                    setIsCostCenterComboboxOpen(false);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <span className="font-medium block truncate">
                                      {costCenter.codigo} - {costCenter.nombre}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCostCenterModalOpen(true)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        +
                      </button>
                    </div>
                    {errors.cuentaGastoId && (
                      <p className="text-red-600 text-sm mt-1">
                        El centro de costo es requerido
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Resumen */}
          <AccordionItem value="resumen">
            <AccordionTrigger className="text-lg font-medium">
              Resumen
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtotal
                    </label>
                    <input
                      type="text"
                      value={subtotal.toFixed(2)}
                      className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ITBIS
                    </label>
                    <input
                      type="text"
                      {...register("itbis")}
                      className="mt-1 block w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <textarea
                    {...register("observaciones")}
                    className="mt-1 block w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isLoading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>

      <ProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSuccess={() => {
          // The form will automatically update with the new provider
          // since we're using the providers from the store
        }}
      />

      <CostCenterModal
        isOpen={isCostCenterModalOpen}
        onClose={() => setIsCostCenterModalOpen(false)}
      />
    </div>
  );
}

