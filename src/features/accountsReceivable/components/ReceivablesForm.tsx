import { useForm } from "react-hook-form";
import { Customer, PaymentMethod, ReceivableTransaction } from "../types";

interface ReceivableFormData {
  customerId: string;
  monto: string;
  fecha: string;
  concepto: string;
  metodoPago: PaymentMethod;
  reciboId?: string;
}

interface ReceivablesFormProps {
  customers: Customer[];
  onSubmit: (data: ReceivableFormData) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export default function ReceivablesForm({
  customers,
  onSubmit,
  isLoading,
  error,
}: ReceivablesFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceivableFormData>({
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      metodoPago: "CASH",
    },
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Ingreso</h3>
      {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Cliente</label>
          <select
            {...register("customerId", { required: "Seleccione un cliente" })}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione un cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.nombre}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.customerId.message}
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
          <label className="block text-sm">Fecha</label>
          <input
            type="date"
            {...register("fecha", { required: "La fecha es requerida" })}
            className="w-full p-2 border rounded"
          />
          {errors.fecha && (
            <p className="text-red-600 text-sm mt-1">{errors.fecha.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm">Concepto</label>
          <input
            type="text"
            {...register("concepto", {
              required: "El concepto es requerido",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.concepto && (
            <p className="text-red-600 text-sm mt-1">
              {errors.concepto.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm">Método de Pago</label>
          <select
            {...register("metodoPago", {
              required: "Seleccione el método de pago",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="CASH">Efectivo</option>
            <option value="TRANSFER">Transferencia</option>
            <option value="CHECK">Cheque</option>
            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
          </select>
          {errors.metodoPago && (
            <p className="text-red-600 text-sm mt-1">
              {errors.metodoPago.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm">Recibo Relacionado (opcional)</label>
          <input
            type="text"
            {...register("reciboId")}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? "Registrando..." : "Registrar Ingreso"}
        </button>
      </form>
    </div>
  );
}
