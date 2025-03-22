export interface Project {
  id: number;
  nombre: string;
  codigo: string;
  ubicacion: string;
  estado: "activo" | "completado" | "pausado";
  fechaInicio: string;
  fechaFin?: string;
  presupuesto: number;
  costoActual: number;
  descripcion: string;
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
