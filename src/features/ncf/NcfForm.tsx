import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NcfFormData, NcfType } from "./types";
import { validateNcfNumber } from "./services";

const ncfSchema = z.object({
  tipo: z.enum([
    "B01",
    "B02",
    "B03",
    "B04",
    "B14",
    "B15",
    "B16",
    "B17",
    "B18",
    "B19",
    "B20",
    "B21",
    "B22",
    "B23",
    "B24",
    "B25",
    "B26",
    "B27",
    "B28",
    "B29",
    "B30",
    "B31",
    "B32",
    "B33",
    "B34",
    "B35",
    "B36",
    "B37",
    "B38",
    "B39",
    "B40",
    "B41",
    "B42",
    "B43",
    "B44",
    "B45",
    "B46",
    "B47",
    "B48",
    "B49",
    "B50",
    "E31",
    "E32",
    "E33",
    "E34",
    "E35",
    "E36",
    "E37",
    "E38",
    "E39",
    "E40",
    "E41",
    "E42",
    "E43",
    "E44",
    "E45",
    "E46",
    "E47",
    "E48",
    "E49",
    "E50",
  ] as const),
  numero: z.string().refine(validateNcfNumber, {
    message:
      "El número de NCF debe comenzar con B01, B02, etc. y tener 11 dígitos",
  }),
  cliente: z.string().min(1, "El cliente es requerido"),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "La fecha debe ser válida",
  }),
  monto: z.number().min(0, "El monto debe ser mayor a 0"),
  itbis: z.number().min(0, "El ITBIS debe ser mayor a 0"),
  total: z.number().min(0, "El total debe ser mayor a 0"),
  observaciones: z.string().optional(),
});

interface NcfFormProps {
  onSubmit: (data: NcfFormData) => void;
  isLoading?: boolean;
}

export default function NcfForm({ onSubmit, isLoading }: NcfFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NcfFormData>({
    resolver: zodResolver(ncfSchema),
    defaultValues: {
      tipo: "B01",
      fecha: new Date().toISOString().split("T")[0],
      monto: 0,
      itbis: 0,
      total: 0,
    },
  });

  const tipo = watch("tipo");
  const monto = watch("monto");
  const itbis = watch("itbis");

  // Calcular total automáticamente
  const total = monto + itbis;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Registrar NCF</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              {...register("tipo")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="B01">Crédito Fiscal</option>
              <option value="B02">Consumo</option>
              <option value="B03">Gasto Menor</option>
              <option value="B04">Gubernamental</option>
              <option value="B14">Regímenes Especiales</option>
              <option value="B15">Gubernamental</option>
              <option value="B16">Zona Franca</option>
              <option value="B17">Exportaciones</option>
              <option value="B18">Comprobante de Pago</option>
              <option value="B19">Comprobante de Pago</option>
              <option value="B20">Comprobante de Pago</option>
              <option value="B21">Comprobante de Pago</option>
              <option value="B22">Comprobante de Pago</option>
              <option value="B23">Comprobante de Pago</option>
              <option value="B24">Comprobante de Pago</option>
              <option value="B25">Comprobante de Pago</option>
              <option value="B26">Comprobante de Pago</option>
              <option value="B27">Comprobante de Pago</option>
              <option value="B28">Comprobante de Pago</option>
              <option value="B29">Comprobante de Pago</option>
              <option value="B30">Comprobante de Pago</option>
              <option value="B31">Comprobante de Pago</option>
              <option value="B32">Comprobante de Pago</option>
              <option value="B33">Comprobante de Pago</option>
              <option value="B34">Comprobante de Pago</option>
              <option value="B35">Comprobante de Pago</option>
              <option value="B36">Comprobante de Pago</option>
              <option value="B37">Comprobante de Pago</option>
              <option value="B38">Comprobante de Pago</option>
              <option value="B39">Comprobante de Pago</option>
              <option value="B40">Comprobante de Pago</option>
              <option value="B41">Comprobante de Pago</option>
              <option value="B42">Comprobante de Pago</option>
              <option value="B43">Comprobante de Pago</option>
              <option value="B44">Comprobante de Pago</option>
              <option value="B45">Comprobante de Pago</option>
              <option value="B46">Comprobante de Pago</option>
              <option value="B47">Comprobante de Pago</option>
              <option value="B48">Comprobante de Pago</option>
              <option value="B49">Comprobante de Pago</option>
              <option value="B50">Comprobante de Pago</option>
              <option value="E31">e-CF</option>
              <option value="E32">e-CF</option>
              <option value="E33">e-CF</option>
              <option value="E34">e-CF</option>
              <option value="E35">e-CF</option>
              <option value="E36">e-CF</option>
              <option value="E37">e-CF</option>
              <option value="E38">e-CF</option>
              <option value="E39">e-CF</option>
              <option value="E40">e-CF</option>
              <option value="E41">e-CF</option>
              <option value="E42">e-CF</option>
              <option value="E43">e-CF</option>
              <option value="E44">e-CF</option>
              <option value="E45">e-CF</option>
              <option value="E46">e-CF</option>
              <option value="E47">e-CF</option>
              <option value="E48">e-CF</option>
              <option value="E49">e-CF</option>
              <option value="E50">e-CF</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número
            </label>
            <input
              type="text"
              {...register("numero")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={`Ej: ${tipo}000000001`}
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-red-600">
                {errors.numero.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              {...register("cliente")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Nombre del cliente"
            />
            {errors.cliente && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cliente.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              {...register("fecha")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fecha.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              {...register("monto", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.monto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.monto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ITBIS
            </label>
            <input
              type="number"
              step="0.01"
              {...register("itbis", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.itbis && (
              <p className="mt-1 text-sm text-red-600">
                {errors.itbis.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <input
              type="number"
              value={total}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observaciones
            </label>
            <textarea
              {...register("observaciones")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
            {errors.observaciones && (
              <p className="mt-1 text-sm text-red-600">
                {errors.observaciones.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Registrar NCF"}
          </button>
        </div>
      </div>
    </form>
  );
}
