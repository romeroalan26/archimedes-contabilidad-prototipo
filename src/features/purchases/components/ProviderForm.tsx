import { useForm } from "react-hook-form";
import { Supplier } from "../types";
import { useProviderStore } from "../stores/providerStore";

interface ProviderFormProps {
  defaultValues?: Supplier;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ProviderFormData {
  nombre: string;
  rnc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export default function ProviderForm({
  defaultValues,
  onSuccess,
  onCancel,
}: ProviderFormProps) {
  const { addProvider, updateProvider } = useProviderStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderFormData>({
    defaultValues: defaultValues || {
      nombre: "",
      rnc: "",
      email: "",
      telefono: "",
      direccion: "",
    },
  });

  const onSubmit = (data: ProviderFormData) => {
    if (defaultValues) {
      updateProvider({ ...defaultValues, ...data });
    } else {
      addProvider(data as Supplier);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Proveedor *
        </label>
        <input
          type="text"
          {...register("nombre", { required: "El nombre es requerido" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">RNC *</label>
        <input
          type="text"
          {...register("rnc", { required: "El RNC es requerido" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.rnc && (
          <p className="mt-1 text-sm text-red-600">{errors.rnc.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          {...register("telefono")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <textarea
          {...register("direccion")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {defaultValues ? "Actualizar" : "Crear"} Proveedor
        </button>
      </div>
    </form>
  );
}
