import { useForm } from "react-hook-form";

export default function SalesForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Venta registrada:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Venta</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Cliente</label>
          <input
            {...register("cliente")}
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
        <div>
          <label className="block text-sm">Tipo de Venta</label>
          <select {...register("tipo")} className="w-full p-2 border rounded">
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">NCF</label>
          <input {...register("ncf")} className="w-full p-2 border rounded" />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrar Venta
          </button>
        </div>
      </form>
    </div>
  );
}
