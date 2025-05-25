import { Project, ESTADO_LABELS, ESTADO_COLORS } from "../types";

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

export function ProjectDetailsModal({
  project,
  onClose,
  onEdit,
}: ProjectDetailsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (estado: Project["estado"]) => {
    const color = ESTADO_COLORS[estado] as keyof typeof colorClasses;
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}
      >
        {ESTADO_LABELS[estado]}
      </span>
    );
  };

  const calculateProjectDuration = () => {
    const diffTime = project.fechaFin.getTime() - project.fechaInicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTimeRemaining = () => {
    const now = new Date();
    const diffTime = project.fechaFin.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = () => {
    const totalDuration = calculateProjectDuration();
    const timeElapsed = Math.ceil(
      (new Date().getTime() - project.fechaInicio.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const percentage = Math.min(
      Math.max((timeElapsed / totalDuration) * 100, 0),
      100
    );
    return Math.round(percentage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {project.nombre}
              </h2>
              <p className="text-sm text-gray-500">Detalles del proyecto</p>
            </div>
            {getStatusBadge(project.estado)}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {project.descripcion}
                </p>
              </div>

              {/* Project Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cronograma
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Progreso temporal
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {getProgressPercentage()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Fecha de inicio:</span>
                      <p className="font-medium text-gray-900">
                        {formatDateShort(project.fechaInicio)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Fecha de finalización:
                      </span>
                      <p className="font-medium text-gray-900">
                        {formatDateShort(project.fechaFin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Responsible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Ubicación
                  </h3>
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {project.ubicacion}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Responsable
                  </h3>
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-gray-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <div>
                      <p className="text-gray-900 font-medium">
                        {project.responsable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {project.notasAdicionales && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Notas Adicionales
                  </h3>
                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                    <p className="text-amber-800">{project.notasAdicionales}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Key Metrics */}
            <div className="space-y-6">
              {/* Budget Card */}
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Presupuesto</h3>
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(project.presupuesto)}
                </p>
              </div>

              {/* Project Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duración total:</span>
                    <span className="font-medium text-gray-900">
                      {calculateProjectDuration()} días
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Días restantes:</span>
                    <span
                      className={`font-medium ${calculateTimeRemaining() < 0 ? "text-red-600" : calculateTimeRemaining() < 30 ? "text-amber-600" : "text-green-600"}`}
                    >
                      {calculateTimeRemaining() < 0
                        ? `${Math.abs(calculateTimeRemaining())} días de retraso`
                        : `${calculateTimeRemaining()} días`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progreso temporal:</span>
                    <span className="font-medium text-gray-900">
                      {getProgressPercentage()}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fechas Importantes
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de inicio</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(project.fechaInicio)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Fecha de finalización
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatDate(project.fechaFin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de creación</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(project.fechaCreacion)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cerrar
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Editar Proyecto
          </button>
        </div>
      </div>
    </div>
  );
}
