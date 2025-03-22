import { useForm } from "react-hook-form";

export default function InventoryAssignment() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Asignación registrada:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Asignar Material a Obra</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Obra</label>
          <select
            {...register("obra")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione una obra</option>
            <option value="Obra Hospital Regional">
              Obra Hospital Regional
            </option>
            <option value="Construcción de Puente">
              Construcción de Puente
            </option>
            <option value="Edificio Corporativo">Edificio Corporativo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Material</label>
          <select
            {...register("material")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione un material</option>
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
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Asignar a Obra
          </button>
        </div>
      </form>
    </div>
  );
}
