import { useForm } from "react-hook-form";
import { Supplier } from "../types";

interface PurchaseFormData {
  supplierId: string;
  monto: string;
  itbis: string;
  retencionIsr: string;
  fechaVencimiento: string;
}

interface PurchasesFormProps {
  suppliers: Supplier[];
  selectedSupplier?: Supplier;
  onSubmit: (data: PurchaseFormData) => void;
  isLoading?: boolean;
  error?: Error | null;
  onClearSupplier?: () => void;
}

export default function PurchasesForm({
  suppliers,
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
  } = useForm<PurchaseFormData>({
    defaultValues: {
      supplierId: selectedSupplier?.id.toString() || "",
      monto: "",
      itbis: "",
      retencionIsr: "",
      fechaVencimiento: "",
    },
  });

  const monto = watch("monto");
  const itbisCalculado = monto ? parseFloat(monto) * 0.18 : 0;

  const onFormSubmit = (data: PurchaseFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Registrar Factura de Proveedor
      </h3>
      {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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
            <p className="text-red-600 text-sm mt-1">{errors.monto.message}</p>
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
            <p className="text-red-600 text-sm mt-1">{errors.itbis.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm">Retención ISR</label>
          <input
            type="number"
            step="0.01"
            {...register("retencionIsr", {
              min: { value: 0, message: "La retención no puede ser negativa" },
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
        <div className="md:col-span-2">
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
