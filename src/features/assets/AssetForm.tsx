import { useForm } from "react-hook-form";
import { AssetFormData } from "./types";
import { assetCategories } from "./mockData";

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => void;
}

export default function AssetForm({ onSubmit }: AssetFormProps) {
  const { register, handleSubmit, reset } = useForm<AssetFormData>();

  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit(data);
    reset();
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
            {...register("name", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            {...register("category", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="">Seleccione una categoría</option>
            {assetCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Adquisición
          </label>
          <input
            type="date"
            {...register("acquisitionDate", { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valor Original
          </label>
          <input
            type="number"
            step="0.01"
            {...register("originalValue", { required: true, min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vida Útil (años)
          </label>
          <input
            type="number"
            {...register("usefulLife", { required: true, min: 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm md:text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm md:text-base"
        >
          Registrar Activo
        </button>
      </form>
    </div>
  );
}
