import { useForm } from "react-hook-form";

export default function PayrollForm() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Empleado registrado:", data);
    reset();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Registrar Empleado</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <input
          {...register("nombre")}
          placeholder="Nombre"
          className="p-2 border rounded"
          required
        />
        <input
          {...register("cedula")}
          placeholder="Cédula"
          className="p-2 border rounded"
          required
        />
        <input
          {...register("posicion")}
          placeholder="Posición"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          {...register("salario")}
          placeholder="Salario"
          className="p-2 border rounded"
          required
        />
        <div className="md:col-span-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Agregar Empleado
          </button>
        </div>
      </form>
    </div>
  );
}
