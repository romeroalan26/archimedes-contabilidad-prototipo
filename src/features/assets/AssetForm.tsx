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
    formState: { errors },
  } = useForm<AssetFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Activo
        </label>
        <input
          type="text"
          {...register("name", { required: "El nombre es requerido" })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Ej: Computadora Dell XPS"
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
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Breve descripción del activo"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Seleccione una categoría</option>
          {assetCategories.map((category) => (
            <option key={category} value={category}>
              {category === "equipment" && "Equipos"}
              {category === "furniture" && "Mobiliario"}
              {category === "vehicles" && "Vehículos"}
              {category === "buildings" && "Edificios"}
              {category === "other" && "Otros"}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor Original
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            {...register("originalValue", {
              required: "El valor es requerido",
              min: { value: 0, message: "El valor debe ser mayor a 0" },
            })}
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="0.00"
          />
        </div>
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
            min: { value: 1, message: "Debe ser al menos 1 año" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="5"
        />
        {errors.usefulLife && (
          <p className="mt-1 text-sm text-red-600">
            {errors.usefulLife.message}
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.acquisitionDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.acquisitionDate.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Registrando...
            </>
          ) : (
            "Registrar Activo"
          )}
        </button>
      </div>
    </form>
  );
}
