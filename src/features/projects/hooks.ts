import { useState, useEffect, useMemo, useCallback } from "react";
import { projectsService } from "./services";
import { Project, ProjectFilters, ProjectStats } from "./types";

// Hook para obtener todos los proyectos
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch (err: any) {
      console.error("Error al cargar proyectos:", err);
      setError(err.message || "Error al cargar proyectos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const refetch = () => {
    fetchProjects();
  };

  return {
    projects,
    isLoading,
    error,
    refetch,
  };
};

// Hook para obtener un proyecto por ID
export const useProject = (id: string | null) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectsService.getById(id);
        setProject(data);
      } catch (err: any) {
        console.error(`Error al cargar proyecto ${id}:`, err);
        setError(err.message || "Error al cargar el proyecto");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return {
    project,
    isLoading,
    error,
  };
};

// Hook para filtrar y buscar proyectos
export const useProjectsFilter = (
  projects: Project[],
  filters: ProjectFilters
) => {
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filtro por término de búsqueda
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        project.nombre.toLowerCase().includes(searchLower) ||
        project.descripcion.toLowerCase().includes(searchLower) ||
        project.ubicacion.toLowerCase().includes(searchLower) ||
        project.responsable.toLowerCase().includes(searchLower);

      // Filtro por estado
      const matchesEstado =
        filters.estado === "all" || project.estado === filters.estado;

      // Filtro por fecha desde
      const matchesFechaDesde =
        !filters.fechaDesde ||
        project.fechaInicio >= new Date(filters.fechaDesde);

      // Filtro por fecha hasta
      const matchesFechaHasta =
        !filters.fechaHasta || project.fechaFin <= new Date(filters.fechaHasta);

      return (
        matchesSearch && matchesEstado && matchesFechaDesde && matchesFechaHasta
      );
    });
  }, [projects, filters]);

  return filteredProjects;
};

// Hook para obtener estadísticas de proyectos
export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    planificados: 0,
    enProgreso: 0,
    completados: 0,
    suspendidos: 0,
    cancelados: 0,
    presupuestoTotal: 0,
    presupuestoPromedio: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectsService.getStats();
        setStats(data);
      } catch (err: any) {
        console.error("Error al cargar estadísticas:", err);
        setError(err.message || "Error al cargar estadísticas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
};

// Hook para operaciones CRUD de proyectos
export const useProjectActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: any): Promise<Project | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const newProject = await projectsService.create(projectData);
      return newProject;
    } catch (err: any) {
      console.error("Error al crear proyecto:", err);
      setError(err.message || "Error al crear el proyecto");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (
    id: string,
    projectData: any
  ): Promise<Project | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedProject = await projectsService.update(id, projectData);
      return updatedProject;
    } catch (err: any) {
      console.error(`Error al actualizar proyecto ${id}:`, err);
      setError(err.message || "Error al actualizar el proyecto");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await projectsService.delete(id);
      return true;
    } catch (err: any) {
      console.error(`Error al eliminar proyecto ${id}:`, err);
      setError(err.message || "Error al eliminar el proyecto");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return {
    createProject,
    updateProject,
    deleteProject,
    isLoading,
    error,
    clearError,
  };
};
