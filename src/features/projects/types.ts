// API Response types - Coincide con la respuesta del backend
export interface ApiProject {
  proyecto_id: string;
  nombre: string;
  empresa_id: string;
  descripcion: string;
  fecha_inicio: string; // ISO string
  fecha_fin: string; // ISO string
  estado:
    | "PLANIFICADO"
    | "EN_PROGRESO"
    | "COMPLETADO"
    | "SUSPENDIDO"
    | "CANCELADO";
  presupuesto: string; // Decimal como string
  ubicacion: string;
  responsable: string;
  notas_adicionales: string;
  created_at: string; // ISO string
}

// API Response wrapper for projects list
export interface ApiProjectsResponse {
  mensaje: string;
  proyectos: ApiProject[];
  total: number;
}

// API Response wrapper for single project
export interface ApiProjectResponse {
  mensaje: string;
  proyecto: ApiProject;
}

// Application types - Formato interno de la aplicación
export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  estado:
    | "PLANIFICADO"
    | "EN_PROGRESO"
    | "COMPLETADO"
    | "SUSPENDIDO"
    | "CANCELADO";
  presupuesto: number;
  ubicacion: string;
  responsable: string;
  notasAdicionales: string;
  fechaCreacion: Date;
}

// Form data types
export interface ProjectFormData {
  nombre: string;
  descripcion: string;
  fechaInicio: string; // ISO string for forms
  fechaFin: string; // ISO string for forms
  estado:
    | "PLANIFICADO"
    | "EN_PROGRESO"
    | "COMPLETADO"
    | "SUSPENDIDO"
    | "CANCELADO";
  presupuesto: number;
  ubicacion: string;
  responsable: string;
  notasAdicionales: string;
}

// Filter and search types
export interface ProjectFilters {
  searchTerm: string;
  estado:
    | "all"
    | "PLANIFICADO"
    | "EN_PROGRESO"
    | "COMPLETADO"
    | "SUSPENDIDO"
    | "CANCELADO";
  fechaDesde?: string;
  fechaHasta?: string;
}

// Statistics types
export interface ProjectStats {
  total: number;
  planificados: number;
  enProgreso: number;
  completados: number;
  suspendidos: number;
  cancelados: number;
  presupuestoTotal: number;
  presupuestoPromedio: number;
}

// Status labels
export const ESTADO_LABELS: Record<Project["estado"], string> = {
  PLANIFICADO: "Planificado",
  EN_PROGRESO: "En Progreso",
  COMPLETADO: "Completado",
  SUSPENDIDO: "Suspendido",
  CANCELADO: "Cancelado",
};

// Status colors for UI
export const ESTADO_COLORS: Record<Project["estado"], string> = {
  PLANIFICADO: "blue",
  EN_PROGRESO: "yellow",
  COMPLETADO: "green",
  SUSPENDIDO: "gray",
  CANCELADO: "red",
};

export interface ProjectResource {
  id: number;
  projectId: number;
  productId: number;
  cantidad: number;
  costoUnitario: number;
  fechaAsignacion: string;
  estado: "pendiente" | "aprobado" | "rechazado";
}

export interface ProjectCost {
  id: number;
  projectId: number;
  concepto: string;
  monto: number;
  fecha: string;
  tipo: "material" | "mano_obra" | "servicios" | "otros";
}

export interface ProjectProfitability {
  projectId: number;
  ingresosEstimados: number;
  costosEstimados: number;
  margenEstimado: number;
  fechaCalculo: string;
}
