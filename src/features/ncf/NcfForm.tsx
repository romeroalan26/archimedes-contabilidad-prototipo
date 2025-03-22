import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NcfFormData } from "./types";
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Comprobante
        </label>
        <select
          {...register("tipo")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="B01">B01 - Crédito Fiscal</option>
          <option value="B02">B02 - Consumo</option>
          <option value="B03">B03 - Gasto Menor</option>
          <option value="B04">B04 - Gubernamental</option>
          <option value="B14">B14 - Regímenes Especiales</option>
          <option value="B15">B15 - Gubernamental</option>
          <option value="B16">B16 - Zona Franca</option>
          <option value="B17">B17 - Exportaciones</option>
          <option value="E31">E31 - e-CF</option>
        </select>
        {errors.tipo && (
          <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número de Comprobante
        </label>
        <input
          type="text"
          {...register("numero")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder={`${tipo}000000001`}
        />
        {errors.numero && (
          <p className="mt-1 text-sm text-red-600">{errors.numero.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <input
          type="text"
          {...register("cliente")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Nombre del cliente"
        />
        {errors.cliente && (
          <p className="mt-1 text-sm text-red-600">{errors.cliente.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha</label>
        <input
          type="date"
          {...register("fecha")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.fecha && (
          <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            {...register("monto", { valueAsNumber: true })}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.monto && (
          <p className="mt-1 text-sm text-red-600">{errors.monto.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">ITBIS</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            {...register("itbis", { valueAsNumber: true })}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
        {errors.itbis && (
          <p className="mt-1 text-sm text-red-600">{errors.itbis.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Total</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            value={total}
            readOnly
            className="pl-7 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          {...register("observaciones")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Observaciones adicionales"
        />
        {errors.observaciones && (
          <p className="mt-1 text-sm text-red-600">
            {errors.observaciones.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registrando...
            </>
          ) : (
            "Registrar Comprobante"
          )}
        </button>
      </div>
    </form>
  );
}
