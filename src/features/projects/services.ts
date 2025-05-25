import axiosInstance from "../../services/axiosConfig";
import {
  Project,
  ApiProject,
  ApiProjectsResponse,
  ApiProjectResponse,
  ProjectFormData,
  ProjectStats,
} from "./types";

// Endpoint para proyectos
const projectsEndpoint = "/proyectos";

// Función para adaptar datos de la API al formato de la aplicación
const adaptApiProject = (apiProject: ApiProject): Project => {
  return {
    id: apiProject.proyecto_id,
    nombre: apiProject.nombre,
    descripcion: apiProject.descripcion,
    fechaInicio: new Date(apiProject.fecha_inicio),
    fechaFin: new Date(apiProject.fecha_fin),
    estado: apiProject.estado,
    presupuesto: parseFloat(apiProject.presupuesto),
    ubicacion: apiProject.ubicacion,
    responsable: apiProject.responsable,
    notasAdicionales: apiProject.notas_adicionales,
    fechaCreacion: new Date(apiProject.created_at),
  };
};

// Función para adaptar datos del formulario al formato de la API
const adaptProjectToApi = (
  project: ProjectFormData
): Omit<ApiProject, "proyecto_id" | "empresa_id" | "created_at"> => {
  return {
    nombre: project.nombre,
    descripcion: project.descripcion,
    fecha_inicio: project.fechaInicio,
    fecha_fin: project.fechaFin,
    estado: project.estado,
    presupuesto: project.presupuesto.toString(),
    ubicacion: project.ubicacion,
    responsable: project.responsable,
    notas_adicionales: project.notasAdicionales,
  };
};

// Función para calcular estadísticas
const calculateStats = (projects: Project[]): ProjectStats => {
  const total = projects.length;
  const planificados = projects.filter(
    (p) => p.estado === "PLANIFICADO"
  ).length;
  const enProgreso = projects.filter((p) => p.estado === "EN_PROGRESO").length;
  const completados = projects.filter((p) => p.estado === "COMPLETADO").length;
  const suspendidos = projects.filter((p) => p.estado === "SUSPENDIDO").length;
  const cancelados = projects.filter((p) => p.estado === "CANCELADO").length;

  const presupuestoTotal = projects.reduce((sum, p) => sum + p.presupuesto, 0);
  const presupuestoPromedio = total > 0 ? presupuestoTotal / total : 0;

  return {
    total,
    planificados,
    enProgreso,
    completados,
    suspendidos,
    cancelados,
    presupuestoTotal,
    presupuestoPromedio,
  };
};

// Servicios para Proyectos
export const projectsService = {
  // GET - Obtener todos los proyectos
  getAll: async (): Promise<Project[]> => {
    try {
      console.log("🔍 Obteniendo proyectos...");
      const response =
        await axiosInstance.get<ApiProjectsResponse>(projectsEndpoint);

      console.log("=== RESPONSE PROJECTS GETALL ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===============================");

      if (!Array.isArray(response.data.proyectos)) {
        console.error(
          "❌ La respuesta no es un array:",
          response.data.proyectos
        );
        throw new Error("Formato de respuesta inválido");
      }

      return response.data.proyectos.map(adaptApiProject);
    } catch (error: any) {
      console.error("❌ Error al obtener proyectos:", error);

      if (error.response?.status === 401) {
        throw new Error("Token de autenticación inválido o expirado");
      } else if (error.response?.status === 403) {
        throw new Error("No tiene permisos para acceder a los proyectos");
      } else if (error.response?.status === 500) {
        throw new Error("Error interno del servidor");
      } else if (error.message?.includes("Network")) {
        throw new Error("Error de conexión con el servidor");
      }

      throw new Error("Error al cargar proyectos");
    }
  },

  // GET por ID - Obtener un proyecto específico
  getById: async (id: string): Promise<Project> => {
    try {
      console.log(`🔍 Obteniendo proyecto ${id}...`);
      const response = await axiosInstance.get<ApiProjectResponse>(
        `${projectsEndpoint}/${id}`
      );

      console.log("=== RESPONSE PROJECT GETBYID ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("================================");

      return adaptApiProject(response.data.proyecto);
    } catch (error: any) {
      console.error(`❌ Error al obtener proyecto ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error("Proyecto no encontrado");
      }

      throw new Error("Error al cargar el proyecto");
    }
  },

  // POST - Crear un nuevo proyecto
  create: async (project: ProjectFormData): Promise<Project> => {
    try {
      console.log("📝 Creando proyecto...", project);
      const apiProject = adaptProjectToApi(project);
      const response = await axiosInstance.post<ApiProjectResponse>(
        projectsEndpoint,
        apiProject
      );

      console.log("=== RESPONSE PROJECT CREATE ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===============================");

      return adaptApiProject(response.data.proyecto);
    } catch (error: any) {
      console.error("❌ Error al crear proyecto:", error);

      if (error.response?.status === 400) {
        throw new Error("Datos del proyecto inválidos");
      }

      throw new Error("Error al crear el proyecto");
    }
  },

  // PUT - Actualizar un proyecto existente
  update: async (
    id: string,
    project: Partial<ProjectFormData>
  ): Promise<Project> => {
    try {
      console.log(`📝 Actualizando proyecto ${id}...`);
      console.log("Datos originales del frontend:", project);

      const apiProject = adaptProjectToApi(project as ProjectFormData);
      console.log("Datos adaptados para API:", apiProject);
      console.log("Número de campos enviados:", Object.keys(apiProject).length);
      console.log("Campos enviados:", Object.keys(apiProject));

      const response = await axiosInstance.put<ApiProjectResponse>(
        `${projectsEndpoint}/${id}`,
        apiProject
      );

      console.log("=== RESPONSE PROJECT UPDATE ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===============================");

      return adaptApiProject(response.data.proyecto);
    } catch (error: any) {
      console.error(`❌ Error al actualizar proyecto ${id}:`, error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      if (error.response?.status === 404) {
        throw new Error("Proyecto no encontrado");
      } else if (error.response?.status === 400) {
        throw new Error("Datos del proyecto inválidos");
      }

      throw new Error("Error al actualizar el proyecto");
    }
  },

  // DELETE - Eliminar un proyecto
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando proyecto ${id}...`);
      await axiosInstance.delete(`${projectsEndpoint}/${id}`);

      console.log("✅ Proyecto eliminado exitosamente");
    } catch (error: any) {
      console.error(`❌ Error al eliminar proyecto ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error("Proyecto no encontrado");
      }

      throw new Error("Error al eliminar el proyecto");
    }
  },

  // Obtener estadísticas de proyectos
  getStats: async (): Promise<ProjectStats> => {
    try {
      const projects = await projectsService.getAll();
      return calculateStats(projects);
    } catch (error) {
      console.error("❌ Error al calcular estadísticas:", error);
      // Retornar estadísticas vacías en caso de error
      return {
        total: 0,
        planificados: 0,
        enProgreso: 0,
        completados: 0,
        suspendidos: 0,
        cancelados: 0,
        presupuestoTotal: 0,
        presupuestoPromedio: 0,
      };
    }
  },
};
