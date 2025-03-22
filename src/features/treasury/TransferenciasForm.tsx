import { useForm } from "react-hook-form";

interface TransferenciaFormData {
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  fecha: string;
  concepto: string;
}

export default function TransferenciasForm() {
  const { register, handleSubmit, reset } = useForm<TransferenciaFormData>();

  const onSubmit = (data: TransferenciaFormData) => {
    console.log("Transferencia registrada:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Transferencia</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuenta Origen
          </label>
          <input
            type="text"
            {...register("cuentaOrigen")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuenta Destino
          </label>
          <input
            type="text"
            {...register("cuentaDestino")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Concepto
          </label>
          <textarea
            {...register("concepto")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Registrar Transferencia
        </button>
      </form>
    </div>
  );
}
