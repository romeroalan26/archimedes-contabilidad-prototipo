import { useForm } from "react-hook-form";
import { AssetFormData } from "./types";
import { assetCategories } from "./mockData";

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function AssetForm({
  onSubmit,
  isLoading = false,
}: AssetFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>();

  const handleFormSubmit = async (data: AssetFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-base md:text-lg font-semibold mb-4">
        Registrar Nuevo Activo Fijo
      </h3>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-3 md:space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Activo
          </label>
          <input
            type="text"
            {...register("name", { required: "El nombre es requerido" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("description", {
              required: "La descripción es requerida",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
            rows={2}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            {...register("category", { required: "La categoría es requerida" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="">Seleccione una categoría</option>
            {assetCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Adquisición
          </label>
          <input
            type="date"
            {...register("acquisitionDate", {
              required: "La fecha es requerida",
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.acquisitionDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.acquisitionDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valor Original
          </label>
          <input
            type="number"
            step="0.01"
            {...register("originalValue", {
              required: "El valor es requerido",
              min: { value: 0, message: "El valor debe ser mayor a 0" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.originalValue && (
            <p className="mt-1 text-sm text-red-600">
              {errors.originalValue.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vida Útil (años)
          </label>
          <input
            type="number"
            {...register("usefulLife", {
              required: "La vida útil es requerida",
              min: { value: 1, message: "La vida útil debe ser mayor a 0" },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.usefulLife && (
            <p className="mt-1 text-sm text-red-600">
              {errors.usefulLife.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm md:text-base ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Registrando..." : "Registrar Activo"}
        </button>
      </form>
    </div>
  );
}
