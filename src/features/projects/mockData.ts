import {
  Project,
  ProjectResource,
  ProjectCost,
  ProjectProfitability,
} from "./types";

export const mockProjects: Project[] = [
  {
    id: 1,
    nombre: "Edificio Residencial Torres del Sol",
    codigo: "PROJ-001",
    ubicacion: "Av. Principal 123",
    estado: "activo",
    fechaInicio: "2024-01-15",
    presupuesto: 1500000,
    costoActual: 450000,
    descripcion: "Edificio de 12 pisos con 24 departamentos",
    responsable: "Juan Pérez",
  },
  {
    id: 2,
    nombre: "Centro Comercial Plaza Central",
    codigo: "PROJ-002",
    ubicacion: "Calle Comercial 456",
    estado: "pausado",
    fechaInicio: "2024-02-01",
    presupuesto: 2500000,
    costoActual: 750000,
    descripcion: "Centro comercial de 3 niveles con 50 locales",
    responsable: "María García",
  },
  {
    id: 3,
    nombre: "Oficinas Corporativas",
    codigo: "PROJ-003",
    ubicacion: "Zona Empresarial 789",
    estado: "completado",
    fechaInicio: "2023-10-01",
    fechaFin: "2024-03-15",
    presupuesto: 800000,
    costoActual: 780000,
    descripcion: "Edificio de oficinas de 8 pisos",
    responsable: "Carlos López",
  },
];

export const mockResources: ProjectResource[] = [
  {
    id: 1,
    projectId: 1,
    productId: 1,
    cantidad: 100,
    costoUnitario: 150,
    fechaAsignacion: "2024-01-20",
    estado: "aprobado",
  },
  {
    id: 2,
    projectId: 1,
    productId: 2,
    cantidad: 50,
    costoUnitario: 200,
    fechaAsignacion: "2024-01-25",
    estado: "pendiente",
  },
  {
    id: 3,
    projectId: 2,
    productId: 3,
    cantidad: 75,
    costoUnitario: 180,
    fechaAsignacion: "2024-02-05",
    estado: "aprobado",
  },
];

export const mockCosts: ProjectCost[] = [
  {
    id: 1,
    projectId: 1,
    concepto: "Materiales de construcción",
    monto: 250000,
    fecha: "2024-01-20",
    tipo: "material",
  },
  {
    id: 2,
    projectId: 1,
    concepto: "Mano de obra",
    monto: 150000,
    fecha: "2024-01-25",
    tipo: "mano_obra",
  },
  {
    id: 3,
    projectId: 2,
    concepto: "Servicios de arquitectura",
    monto: 50000,
    fecha: "2024-02-05",
    tipo: "servicios",
  },
];

export const mockProfitability: ProjectProfitability[] = [
  {
    projectId: 1,
    ingresosEstimados: 1800000,
    costosEstimados: 1500000,
    margenEstimado: 20,
    fechaCalculo: "2024-03-20",
  },
  {
    projectId: 2,
    ingresosEstimados: 3000000,
    costosEstimados: 2500000,
    margenEstimado: 16.67,
    fechaCalculo: "2024-03-20",
  },
  {
    projectId: 3,
    ingresosEstimados: 1000000,
    costosEstimados: 780000,
    margenEstimado: 22,
    fechaCalculo: "2024-03-20",
  },
];
