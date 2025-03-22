import { useForm } from "react-hook-form";
import { suppliers } from "../../data/suppliers";

export default function PurchasesForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Factura registrada:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Registrar Factura de Proveedor
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm">Proveedor</label>
          <select
            {...register("proveedor")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccione un proveedor</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.nombre}
              </option>
            ))}
          </select>
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
          <label className="block text-sm">ITBIS</label>
          <input
            type="number"
            {...register("itbis")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Retención ISR</label>
          <input
            type="number"
            {...register("retencion")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Fecha de Vencimiento</label>
          <input
            type="date"
            {...register("vencimiento")}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrar Factura
          </button>
        </div>
      </form>
    </div>
  );
}
