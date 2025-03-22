import { useForm } from "react-hook-form";

export default function BankOperations() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Operación registrada:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Registrar Transferencia o Cheque
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Tipo</label>
          <select
            {...register("tipo")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione</option>
            <option value="transferencia">Transferencia</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Banco</label>
          <input
            type="text"
            {...register("banco")}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Beneficiario</label>
          <input
            type="text"
            {...register("beneficiario")}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Monto</label>
          <input
            type="number"
            {...register("monto")}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrar Operación
          </button>
        </div>
      </form>
    </div>
  );
}
