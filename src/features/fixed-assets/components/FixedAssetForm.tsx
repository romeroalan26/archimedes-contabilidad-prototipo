import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FixedAssetFormData,
  DepreciationMethod,
} from "../types/fixedAsset.types";
import { useCreateFixedAsset } from "../hooks/useCreateFixedAsset";
import { useUpdateFixedAsset } from "../hooks/useUpdateFixedAsset";

const fixedAssetSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  acquisitionDate: z.string().min(1, "La fecha de adquisición es requerida"),
  cost: z.number().positive("El costo debe ser mayor a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  status: z.enum(["active", "maintenance", "retired", "sold"]),
  usefulLife: z.number().positive("La vida útil debe ser mayor a 0"),
  depreciationMethod: z.enum([
    "straight-line",
    "declining-balance",
    "sum-of-years",
  ] as const),
  provider: z.string().min(1, "El proveedor es requerido"),
  costCenter: z.string().min(1, "El centro de costo es requerido"),
});

type FixedAssetFormSchema = z.infer<typeof fixedAssetSchema>;

interface FixedAssetFormProps {
  initialData?: FixedAssetFormSchema & { id?: string };
  onSuccess?: () => void;
}

export function FixedAssetForm({
  initialData,
  onSuccess,
}: FixedAssetFormProps) {
  const createMutation = useCreateFixedAsset();
  const updateMutation = useUpdateFixedAsset();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FixedAssetFormSchema>({
    resolver: zodResolver(fixedAssetSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      acquisitionDate: "",
      cost: 0,
      category: "",
      location: "",
      status: "active",
      usefulLife: 1,
      depreciationMethod: "straight-line",
      provider: "",
      costCenter: "",
    },
  });

  const onSubmit = async (data: FixedAssetFormSchema) => {
    try {
      const formData: FixedAssetFormData = {
        ...data,
        description: data.description || "",
      };

      if (initialData?.id) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving fixed asset:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Activo
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría
          </label>
          <select
            id="category"
            {...register("category")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar categoría</option>
            <option value="equipment">Equipos</option>
            <option value="furniture">Mobiliario</option>
            <option value="vehicles">Vehículos</option>
            <option value="buildings">Edificios</option>
            <option value="other">Otros</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="acquisitionDate"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha de Adquisición
          </label>
          <input
            type="date"
            id="acquisitionDate"
            {...register("acquisitionDate")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.acquisitionDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.acquisitionDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cost"
            className="block text-sm font-medium text-gray-700"
          >
            Costo de Adquisición
          </label>
          <input
            type="number"
            id="cost"
            {...register("cost", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
          {errors.cost && (
            <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="usefulLife"
            className="block text-sm font-medium text-gray-700"
          >
            Vida Útil (años)
          </label>
          <input
            type="number"
            id="usefulLife"
            {...register("usefulLife", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="1"
          />
          {errors.usefulLife && (
            <p className="mt-1 text-sm text-red-600">
              {errors.usefulLife.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="depreciationMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Método de Depreciación
          </label>
          <select
            id="depreciationMethod"
            {...register("depreciationMethod")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="straight-line">Línea Recta</option>
            <option value="declining-balance">Saldo Decreciente</option>
            <option value="sum-of-years">Suma de Años</option>
          </select>
          {errors.depreciationMethod && (
            <p className="mt-1 text-sm text-red-600">
              {errors.depreciationMethod.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="provider"
            className="block text-sm font-medium text-gray-700"
          >
            Proveedor
          </label>
          <input
            type="text"
            id="provider"
            {...register("provider")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.provider && (
            <p className="mt-1 text-sm text-red-600">
              {errors.provider.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="costCenter"
            className="block text-sm font-medium text-gray-700"
          >
            Centro de Costo (Obra)
          </label>
          <input
            type="text"
            id="costCenter"
            {...register("costCenter")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.costCenter && (
            <p className="mt-1 text-sm text-red-600">
              {errors.costCenter.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Ubicación Física
          </label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Estado
          </label>
          <select
            id="status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="active">Activo</option>
            <option value="maintenance">En Mantenimiento</option>
            <option value="retired">Retirado</option>
            <option value="sold">Vendido</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Guardando..." : "Guardar Activo"}
        </button>
      </div>
    </form>
  );
}
