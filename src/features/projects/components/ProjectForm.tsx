import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProject, useUpdateProject } from "../hooks";
import type { Project } from "../types";

interface ProjectFormData {
  nombre: string;
  codigo: string;
  ubicacion: string;
  estado: "Activo" | "Completado" | "Pausado";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: project || {
      estado: "Activo",
      presupuesto: 0,
    },
  });

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {mode === "create" ? "Nuevo Proyecto" : "Editar Proyecto"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre", { required: "El nombre es requerido" })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              {...register("codigo", { required: "El código es requerido" })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.codigo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              {...register("ubicacion", {
                required: "La ubicación es requerida",
              })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.ubicacion && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ubicacion.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("estado")}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Activo">Activo</option>
              <option value="Pausado">Pausado</option>
              <option value="Completado">Completado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              {...register("fechaInicio", {
                required: "La fecha de inicio es requerida",
              })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.fechaInicio && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fechaInicio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              {...register("fechaFin")}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Presupuesto
            </label>
            <input
              type="number"
              step="0.01"
              {...register("presupuesto", {
                required: "El presupuesto es requerido",
                min: { value: 0, message: "El presupuesto debe ser mayor a 0" },
              })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.presupuesto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.presupuesto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <input
              type="text"
              {...register("responsable", {
                required: "El responsable es requerido",
              })}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.responsable && (
              <p className="mt-1 text-sm text-red-600">
                {errors.responsable.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            {...register("descripcion")}
            rows={3}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/proyectos")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {mode === "create" ? "Crear Proyecto" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
