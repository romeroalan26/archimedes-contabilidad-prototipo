import { useForm } from "react-hook-form";

export default function InventoryMovement() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Movimiento registrado:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Registrar Movimiento</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Producto</label>
          <select
            {...register("producto")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione un producto</option>
            <option value="Bloques">Bloques</option>
            <option value="Cemento">Cemento</option>
            <option value="Varilla">Varilla</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Cantidad</label>
          <input
            type="number"
            {...register("cantidad")}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Tipo</label>
          <select
            {...register("tipo")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrar Movimiento
          </button>
        </div>
      </form>
    </div>
  );
}
