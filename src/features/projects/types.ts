export interface Project {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: "Activo" | "Completado" | "Pausado";
  presupuesto: number;
  costoActual: number;
  ubicacion: string;
  responsable: string;
}

export interface ProjectFormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "Activo" | "Completado" | "Pausado";
  presupuesto: number;
  ubicacion: string;
  responsable: string;
}

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
