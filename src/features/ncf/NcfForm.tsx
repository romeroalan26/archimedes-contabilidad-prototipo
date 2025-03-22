import { useForm } from "react-hook-form";
import { Ncf } from "./ncfData";

interface NcfFormData {
  tipo: string;
  numero: string;
  cliente: string;
  fecha: string;
}

export default function NcfForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NcfFormData>();

  const onSubmit = (data: NcfFormData) => {
    console.log("NCF registrado:", data);
    reset();
  };

  const validateNcfNumber = (value: string) => {
    const ncfPattern = /^[A-Z]\d{9}$/;
    return (
      ncfPattern.test(value) ||
      "El formato del NCF debe ser una letra seguida de 9 dígitos"
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Registrar NCF</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Comprobante
            </label>
            <select
              {...register("tipo", { required: "El tipo es requerido" })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un tipo</option>
              <option value="Factura de Crédito Fiscal">
                Factura de Crédito Fiscal
              </option>
              <option value="Factura de Consumo">Factura de Consumo</option>
              <option value="Gasto Menor">Gasto Menor</option>
              <option value="Comprobante para exportación">Exportación</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número NCF
            </label>
            <input
              {...register("numero", {
                required: "El número es requerido",
                validate: validateNcfNumber,
              })}
              placeholder="Ej: B0100000001"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-red-600">
                {errors.numero.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente o Proveedor
            </label>
            <input
              {...register("cliente", { required: "El cliente es requerido" })}
              placeholder="Nombre del cliente"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.cliente && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cliente.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              {...register("fecha", { required: "La fecha es requerida" })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fecha.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrar NCF
          </button>
        </div>
      </form>
    </div>
  );
}
