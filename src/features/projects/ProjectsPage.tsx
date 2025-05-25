import { useState, useMemo } from "react";
import {
  useProjects,
  useProjectsFilter,
  useProjectStats,
  useProjectActions,
} from "./hooks";
import { ProjectFilters, Project, ESTADO_LABELS, ESTADO_COLORS } from "./types";
import { ProjectFormModal } from "./components/ProjectFormModal";
import { ProjectDetailsModal } from "./components/ProjectDetailsModal";
import { ProjectStatsCards } from "./components/ProjectStatsCards";

export default function ProjectsPage() {
  const { projects, isLoading, error, refetch } = useProjects();
  const { stats } = useProjectStats();
  const { deleteProject } = useProjectActions();

  // Estados locales
  const [filters, setFilters] = useState<ProjectFilters>({
    searchTerm: "",
    estado: "all",
    fechaDesde: "",
    fechaHasta: "",
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Proyectos filtrados
  const filteredProjects = useProjectsFilter(projects, filters);

  // Paginación
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  // Handlers
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowFormModal(true);
  };

  const handleDeleteProject = async (project: Project) => {
    if (
      confirm(
        `¿Está seguro que desea eliminar el proyecto "${project.nombre}"?`
      )
    ) {
      const success = await deleteProject(project.id);
      if (success) {
        refetch();
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedProject(null);
    setShowFormModal(true);
  };

  const handleFormClose = (shouldRefetch = false) => {
    setShowFormModal(false);
    setSelectedProject(null);
    if (shouldRefetch) {
      refetch();
    }
  };

  const handleDetailsClose = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
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
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
      >
        {ESTADO_LABELS[estado]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar proyectos
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona y monitorea tus proyectos de construcción
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleCreateNew}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                Nuevo Proyecto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectStatsCards stats={stats} />

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, ubicación, responsable..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      estado: e.target.value as any,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="PLANIFICADO">Planificado</option>
                  <option value="EN_PROGRESO">En Progreso</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              {/* Fecha desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={filters.fechaDesde}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fechaDesde: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={filters.fechaHasta}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fechaHasta: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* View controls */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {filteredProjects.length} proyecto
                  {filteredProjects.length !== 1 ? "s" : ""} encontrado
                  {filteredProjects.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Items per page */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Mostrar:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-md ${viewMode === "table" ? "bg-white shadow-sm" : ""}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List/Grid */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proyecto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsable
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fechas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.nombre}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.descripcion}
                          </div>
                          <div className="text-sm text-gray-500">
                            📍 {project.ubicacion}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(project.estado)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(project.presupuesto)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {project.responsable}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>Inicio: {formatDate(project.fechaInicio)}</div>
                        <div>Fin: {formatDate(project.fechaFin)}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        a{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredProjects.length
                          )}
                        </span>{" "}
                        de{" "}
                        <span className="font-medium">
                          {filteredProjects.length}
                        </span>{" "}
                        resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Anterior</span>
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === page
                                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Siguiente</span>
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.nombre}
                    </h3>
                    {getStatusBadge(project.estado)}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.descripcion}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {project.ubicacion}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {project.responsable}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {formatCurrency(project.presupuesto)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <div>Inicio: {formatDate(project.fechaInicio)}</div>
                    <div>Fin: {formatDate(project.fechaFin)}</div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron proyectos
            </h3>
            <p className="text-gray-500 mb-6">
              {projects.length === 0
                ? "Comienza creando tu primer proyecto"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            {projects.length === 0 && (
              <button
                onClick={handleCreateNew}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Crear Primer Proyecto
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showFormModal && (
        <ProjectFormModal project={selectedProject} onClose={handleFormClose} />
      )}

      {showDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={handleDetailsClose}
          onEdit={() => {
            handleDetailsClose();
            handleEditProject(selectedProject);
          }}
        />
      )}
    </div>
  );
}
