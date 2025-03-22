import { useForm } from "react-hook-form";
import { useCreateEmployee } from "./hooks";

interface EmployeeFormData {
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
}

export function PayrollForm() {
  const createEmployee = useCreateEmployee();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await createEmployee.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Error al crear empleado:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          {...register("nombre", { required: "El nombre es requerido" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cédula
        </label>
        <input
          type="text"
          {...register("cedula", {
            required: "La cédula es requerida",
            pattern: {
              value: /^\d{11}$/,
              message: "La cédula debe tener 11 dígitos",
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.cedula && (
          <p className="text-red-500 text-sm">{errors.cedula.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Posición
        </label>
        <input
          type="text"
          {...register("posicion", { required: "La posición es requerida" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.posicion && (
          <p className="text-red-500 text-sm">{errors.posicion.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Salario
        </label>
        <input
          type="number"
          step="0.01"
          {...register("salario", {
            required: "El salario es requerido",
            min: {
              value: 0,
              message: "El salario debe ser mayor a 0",
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.salario && (
          <p className="text-red-500 text-sm">{errors.salario.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        disabled={createEmployee.isPending}
      >
        {createEmployee.isPending ? "Guardando..." : "Guardar Empleado"}
      </button>
    </form>
  );
}
