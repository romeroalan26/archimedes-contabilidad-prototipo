import { useForm } from "react-hook-form";
import { Product } from "../types";
import {
  useProjects,
  useAssignments,
  useCreateAssignment,
  useUpdateAssignmentStatus,
} from "../hooks";

interface AssignmentFormData {
  productId: string;
  projectId: string;
  cantidad: string;
}

interface InventoryAssignmentProps {
  products: Product[];
}

export default function InventoryAssignment({
  products,
}: InventoryAssignmentProps) {
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();
  const { data: assignments = [], isLoading: isLoadingAssignments } =
    useAssignments();
  const createAssignment = useCreateAssignment();
  const updateStatus = useUpdateAssignmentStatus();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssignmentFormData>();

  const selectedProductId = watch("productId");
  const selectedProduct = products.find(
    (p) => p.id.toString() === selectedProductId
  );

  const onFormSubmit = async (data: AssignmentFormData) => {
    await createAssignment.mutateAsync({
      productId: parseInt(data.productId),
      projectId: parseInt(data.projectId),
      cantidad: parseFloat(data.cantidad),
    });
    reset();
  };

  const handleStatusUpdate = async (
    id: number,
    estado: "aprobada" | "rechazada"
  ) => {
    await updateStatus.mutateAsync({ id, estado });
  };

  if (isLoadingProjects || isLoadingAssignments) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Nueva Asignación</h3>
        {createAssignment.error && (
          <p className="text-red-600 mb-4">
            Error: {createAssignment.error.message}
          </p>
        )}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm">Producto</label>
            <select
              {...register("productId", { required: "Seleccione un producto" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre} ({product.codigo})
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm">Proyecto</label>
            <select
              {...register("projectId", { required: "Seleccione un proyecto" })}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.nombre} ({project.codigo})
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.projectId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm">Cantidad</label>
            <input
              type="number"
              step="0.01"
              {...register("cantidad", {
                required: "La cantidad es requerida",
                min: { value: 0.01, message: "La cantidad debe ser mayor a 0" },
                validate: (value) => {
                  if (!selectedProduct) return true;
                  const cantidad = parseFloat(value);
                  if (cantidad > selectedProduct.stock) {
                    return "No hay suficiente stock disponible";
                  }
                  return true;
                },
              })}
              className="w-full p-2 border rounded"
            />
            {errors.cantidad && (
              <p className="text-red-600 text-sm mt-1">
                {errors.cantidad.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createAssignment.isPending}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
            >
              {createAssignment.isPending ? "Creando..." : "Crear Asignación"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Asignaciones Pendientes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => {
                const product = products.find(
                  (p) => p.id === assignment.productId
                );
                const project = projects.find(
                  (p) => p.id === assignment.projectId
                );
                return (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product?.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project?.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assignment.estado === "aprobada"
                            ? "bg-green-100 text-green-800"
                            : assignment.estado === "rechazada"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {assignment.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.estado === "pendiente" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(assignment.id, "aprobada")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(assignment.id, "rechazada")
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
