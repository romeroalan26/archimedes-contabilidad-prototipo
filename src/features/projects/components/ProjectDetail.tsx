import { useParams } from "react-router-dom";
import {
  useProject,
  useProjectResources,
  useProjectCosts,
  useProjectProfitability,
} from "../hooks";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || "0", 10);

  const { data: project, isLoading: isLoadingProject } = useProject(projectId);
  const { data: resources = [], isLoading: isLoadingResources } =
    useProjectResources(projectId);
  const { data: costs = [], isLoading: isLoadingCosts } =
    useProjectCosts(projectId);
  const { data: profitability, isLoading: isLoadingProfitability } =
    useProjectProfitability(projectId);

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="p-4">Proyecto no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">{project.nombre}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Código</p>
            <p className="font-medium">{project.codigo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ubicación</p>
            <p className="font-medium">{project.ubicacion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                project.estado === "activo"
                  ? "bg-green-100 text-green-800"
                  : project.estado === "completado"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {project.estado}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Responsable</p>
            <p className="font-medium">{project.responsable}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha Inicio</p>
            <p className="font-medium">
              {new Date(project.fechaInicio).toLocaleDateString()}
            </p>
          </div>
          {project.fechaFin && (
            <div>
              <p className="text-sm text-gray-500">Fecha Fin</p>
              <p className="font-medium">
                {new Date(project.fechaFin).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recursos Asignados */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recursos Asignados</h3>
        {isLoadingResources ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Unitario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(resource.fechaAsignacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resource.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${resource.costoUnitario.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          resource.estado === "aprobado"
                            ? "bg-green-100 text-green-800"
                            : resource.estado === "rechazado"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {resource.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Costos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Costos</h3>
        {isLoadingCosts ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {costs.map((cost) => (
                  <tr key={cost.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cost.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cost.concepto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cost.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${cost.monto.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rentabilidad */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Rentabilidad</h3>
        {isLoadingProfitability ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : profitability ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ingresos Estimados</p>
              <p className="text-lg font-semibold">
                ${profitability.ingresosEstimados.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Costos Estimados</p>
              <p className="text-lg font-semibold">
                ${profitability.costosEstimados.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Margen Estimado</p>
              <p className="text-lg font-semibold">
                {profitability.margenEstimado}%
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            No hay datos de rentabilidad disponibles
          </p>
        )}
      </div>
    </div>
  );
}
