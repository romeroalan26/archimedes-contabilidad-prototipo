import { useState, useEffect } from "react";
import { Project, ProjectFormData, ESTADO_LABELS } from "../types";
import { useProjectActions } from "../hooks";

interface ProjectFormModalProps {
  project?: Project | null;
  onClose: (shouldRefetch?: boolean) => void;
}

export function ProjectFormModal({ project, onClose }: ProjectFormModalProps) {
  const { createProject, updateProject, isLoading, error, clearError } =
    useProjectActions();

  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    estado: "PLANIFICADO",
    presupuesto: 0,
    ubicacion: "",
    responsable: "",
    notasAdicionales: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Poblar formulario si estamos editando
  useEffect(() => {
    if (project) {
      setFormData({
        nombre: project.nombre,
        descripcion: project.descripcion,
        fechaInicio: project.fechaInicio.toISOString().split("T")[0],
        fechaFin: project.fechaFin.toISOString().split("T")[0],
        estado: project.estado,
        presupuesto: project.presupuesto,
        ubicacion: project.ubicacion,
        responsable: project.responsable,
        notasAdicionales: project.notasAdicionales,
      });
    }
  }, [project]);

  // Limpiar errores cuando se abre el modal
  useEffect(() => {
    // Solo limpiar errores y validaciones cuando el modal se abre
    clearError();
    setValidationErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Ejecutar solo una vez cuando se monta el componente

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del proyecto es obligatorio";
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria";
    }

    if (!formData.fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es obligatoria";
    }

    if (!formData.fechaFin) {
      errors.fechaFin = "La fecha de finalización es obligatoria";
    }

    if (
      formData.fechaInicio &&
      formData.fechaFin &&
      formData.fechaInicio > formData.fechaFin
    ) {
      errors.fechaFin =
        "La fecha de finalización debe ser posterior a la fecha de inicio";
    }

    if (!formData.ubicacion.trim()) {
      errors.ubicacion = "La ubicación es obligatoria";
    }

    if (!formData.responsable.trim()) {
      errors.responsable = "El responsable es obligatorio";
    }

    if (formData.presupuesto <= 0) {
      errors.presupuesto = "El presupuesto debe ser mayor a 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = project
      ? await updateProject(project.id, formData)
      : await createProject(formData);

    if (success) {
      onClose(true);
    }
  };

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario comience a escribir
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {project ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h2>
          <button
            onClick={() => onClose()}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400"
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
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.nombre ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ej: Construcción Edificio Corporativo"
              />
              {validationErrors.nombre && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                rows={3}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.descripcion
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Describe brevemente el proyecto..."
              />
              {validationErrors.descripcion && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.descripcion}
                </p>
              )}
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) =>
                  handleInputChange("fechaInicio", e.target.value)
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.fechaInicio
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.fechaInicio && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.fechaInicio}
                </p>
              )}
            </div>

            {/* Fecha de Finalización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Finalización *
              </label>
              <input
                type="date"
                value={formData.fechaFin}
                onChange={(e) => handleInputChange("fechaFin", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.fechaFin
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.fechaFin && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.fechaFin}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  handleInputChange("estado", e.target.value as any)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(ESTADO_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Presupuesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto (DOP) *
              </label>
              <input
                type="number"
                value={formData.presupuesto}
                onChange={(e) =>
                  handleInputChange(
                    "presupuesto",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="0.01"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.presupuesto
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {validationErrors.presupuesto && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.presupuesto}
                </p>
              )}
            </div>

            {/* Ubicación */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.ubicacion
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Ej: Av. Winston Churchill, Santo Domingo"
              />
              {validationErrors.ubicacion && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.ubicacion}
                </p>
              )}
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsable *
              </label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) =>
                  handleInputChange("responsable", e.target.value)
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.responsable
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                placeholder="Ej: Ing. Carlos Ramírez"
              />
              {validationErrors.responsable && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.responsable}
                </p>
              )}
            </div>

            {/* Notas Adicionales */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notasAdicionales}
                onChange={(e) =>
                  handleInputChange("notasAdicionales", e.target.value)
                }
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Información adicional, observaciones, etc..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {project ? "Actualizando..." : "Creando..."}
                </div>
              ) : project ? (
                "Actualizar Proyecto"
              ) : (
                "Crear Proyecto"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
