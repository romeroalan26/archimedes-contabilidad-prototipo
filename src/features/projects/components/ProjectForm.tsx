import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProject, useUpdateProject } from "../hooks";
import type { Project } from "../types";

interface ProjectFormData {
  nombre: string;
  codigo: string;
  ubicacion: string;
  estado: "activo" | "completado" | "pausado";
  fechaInicio: string;
  fechaFin?: string;
  presupuesto: number;
  descripcion: string;
  responsable: string;
}

interface ProjectFormProps {
  project?: Project;
  mode: "create" | "edit";
}

export default function ProjectForm({ project, mode }: ProjectFormProps) {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: project,
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (mode === "create") {
        await createProject.mutateAsync(data);
      } else if (project) {
        await updateProject.mutateAsync({ id: project.id, data });
      }
      navigate("/proyectos");
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Nuevo Proyecto" : "Editar Proyecto"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código
            </label>
            <input
              type="text"
              {...register("codigo", { required: "El código es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.codigo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              {...register("ubicacion", {
                required: "La ubicación es requerida",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.ubicacion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ubicacion.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              {...register("estado", { required: "El estado es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
              <option value="pausado">Pausado</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">
                {errors.estado.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              {...register("fechaInicio", {
                required: "La fecha de inicio es requerida",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.fechaInicio && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fechaInicio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              {...register("fechaFin")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Presupuesto
            </label>
            <input
              type="number"
              step="0.01"
              {...register("presupuesto", {
                required: "El presupuesto es requerido",
                min: { value: 0, message: "El presupuesto debe ser mayor a 0" },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.presupuesto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.presupuesto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Responsable
            </label>
            <input
              type="text"
              {...register("responsable", {
                required: "El responsable es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.responsable && (
              <p className="mt-1 text-sm text-red-600">
                {errors.responsable.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            {...register("descripcion", {
              required: "La descripción es requerida",
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">
              {errors.descripcion.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/proyectos")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createProject.isPending || updateProject.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {mode === "create" ? "Crear Proyecto" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
