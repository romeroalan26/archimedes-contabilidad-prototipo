import { useForm, useFieldArray } from "react-hook-form";
import {
  Supplier,
  Product,
  Account,
  PayableType,
  PurchaseItem,
} from "../types";

interface PurchaseFormData {
  supplierId: string;
  monto: string;
  itbis: string;
  retencionIsr: string;
  fechaVencimiento: string;
  tipoCuentaPagar: PayableType;
  cuentaGastoId: string;
  cuentaPagarId: string;
  items: {
    productId: string;
    quantity: string;
    price: string;
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
  accounts,
  selectedSupplier,
  onSubmit,
  isLoading,
  error,
  onClearSupplier,
}: PurchasesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<PurchaseFormData>({
    defaultValues: {
      supplierId: selectedSupplier?.id.toString() || "",
      monto: "",
      itbis: "",
      retencionIsr: "",
      fechaVencimiento: "",
      tipoCuentaPagar: "SUPPLIER",
      cuentaGastoId: "",
      cuentaPagarId: "",
      items: [{ productId: "", quantity: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const monto = watch("monto");
  const itbisCalculado = monto ? parseFloat(monto) * 0.18 : 0;

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Proveedor</label>
            <div className="flex gap-2">
              <select
                {...register("supplierId", {
                  required: "Seleccione un proveedor",
                })}
                className="w-full p-2 border rounded"
                disabled={!!selectedSupplier}
              >
                <option value="">Seleccione un proveedor</option>
                {suppliers.map((supplier) => (
                  <option
                    key={supplier.id}
                    value={supplier.id}
                    selected={supplier.id === selectedSupplier?.id}
                  >
                    {supplier.nombre}
                  </option>
                ))}
              </select>
              {selectedSupplier && onClearSupplier && (
                <button
                  type="button"
                  onClick={onClearSupplier}
                  className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              )}
            </div>
            {errors.supplierId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.supplierId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Tipo de Cuenta por Pagar</label>
            <select
              {...register("tipoCuentaPagar", {
                required: "Seleccione el tipo de cuenta",
              })}
              className="w-full p-2 border rounded"
            >
              <option value="SUPPLIER">Suplidor</option>
              <option value="CREDIT_CARD">Tarjeta de Crédito</option>
              <option value="CASH">Caja Chica</option>
            </select>
            {errors.tipoCuentaPagar && (
              <p className="text-red-600 text-sm mt-1">
                {errors.tipoCuentaPagar.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Cuenta de Gasto/Inventario</label>
            <select
              {...register("cuentaGastoId", {
                required: "Seleccione la cuenta de gasto",
              })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione una cuenta</option>
              {accounts
                .filter((account) => account.tipo === "egreso")
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.codigo} - {account.nombre}
                  </option>
                ))}
            </select>
            {errors.cuentaGastoId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.cuentaGastoId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Cuenta por Pagar</label>
            <select
              {...register("cuentaPagarId", {
                required: "Seleccione la cuenta por pagar",
              })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione una cuenta</option>
              {accounts
                .filter((account) => account.tipo === "pasivo")
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.codigo} - {account.nombre}
                  </option>
                ))}
            </select>
            {errors.cuentaPagarId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.cuentaPagarId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Monto</label>
            <input
              type="number"
              step="0.01"
              {...register("monto", {
                required: "El monto es requerido",
                min: { value: 0.01, message: "El monto debe ser mayor a 0" },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.monto && (
              <p className="text-red-600 text-sm mt-1">
                {errors.monto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">ITBIS (18%)</label>
            <input
              type="number"
              step="0.01"
              {...register("itbis", {
                required: "El ITBIS es requerido",
                validate: (value) =>
                  parseFloat(value) === itbisCalculado ||
                  "El ITBIS debe ser 18% del monto",
              })}
              defaultValue={itbisCalculado.toFixed(2)}
              className="w-full p-2 border rounded bg-gray-50"
              readOnly
            />
            {errors.itbis && (
              <p className="text-red-600 text-sm mt-1">
                {errors.itbis.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Retención ISR</label>
            <input
              type="number"
              step="0.01"
              {...register("retencionIsr", {
                min: {
                  value: 0,
                  message: "La retención no puede ser negativa",
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.retencionIsr && (
              <p className="text-red-600 text-sm mt-1">
                {errors.retencionIsr.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm">Fecha de Vencimiento</label>
            <input
              type="date"
              {...register("fechaVencimiento", {
                required: "La fecha de vencimiento es requerida",
              })}
              className="w-full p-2 border rounded"
            />
            {errors.fechaVencimiento && (
              <p className="text-red-600 text-sm mt-1">
                {errors.fechaVencimiento.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Items</h4>
            <button
              type="button"
              onClick={() => append({ productId: "", quantity: "", price: "" })}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Agregar Item
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div>
                  <label className="block text-sm">Producto</label>
                  <select
                    {...register(`items.${index}.productId` as const, {
                      required: "Seleccione un producto",
                    })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.codigo} - {product.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm">Cantidad</label>
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
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm">Precio</label>
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
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? "Registrando..." : "Registrar Factura"}
          </button>
        </div>
      </form>
    </div>
  );
}
