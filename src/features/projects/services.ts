import {
  Project,
  ProjectResource,
  ProjectCost,
  ProjectProfitability,
} from "./types";
import {
  mockProjects,
  mockResources,
  mockCosts,
  mockProfitability,
} from "./mockData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simular error aleatorio (20% de probabilidad)
const simulateError = () => {
  if (Math.random() < 0.2) {
    throw new Error("Error de conexión simulado");
  }
};

// Servicios para Proyectos
export const getProjects = async (): Promise<Project[]> => {
  await delay(300);
  simulateError();
  return mockProjects;
};

export const getProjectById = async (
  id: string
): Promise<Project | undefined> => {
  await delay(300);
  simulateError();
  const project = mockProjects.find((p) => p.id === id);
  if (!project) {
    throw new Error("Proyecto no encontrado");
  }
  return project;
};

export const createProject = async (
  project: Omit<Project, "id" | "costoActual">
): Promise<Project> => {
  await delay(500);
  const newProject: Project = {
    ...project,
    id: String(mockProjects.length + 1),
    costoActual: 0,
  };
  mockProjects.push(newProject);
  return newProject;
};

export const updateProject = async (
  id: string,
  project: Partial<Project>
): Promise<Project> => {
  await delay(500);
  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Proyecto no encontrado");
  mockProjects[index] = { ...mockProjects[index], ...project };
  return mockProjects[index];
};

// Servicios para Recursos
export const getProjectResources = async (
  projectId: number
): Promise<ProjectResource[]> => {
  await delay(300);
  return mockResources.filter((r) => r.projectId === projectId);
};

export const createProjectResource = async (
  resource: Omit<ProjectResource, "id">
): Promise<ProjectResource> => {
  await delay(500);
  const newResource: ProjectResource = {
    ...resource,
    id: mockResources.length + 1,
  };
  mockResources.push(newResource);
  return newResource;
};

// Servicios para Costos
export const getProjectCosts = async (
  projectId: number
): Promise<ProjectCost[]> => {
  await delay(300);
  return mockCosts.filter((c) => c.projectId === projectId);
};

export const createProjectCost = async (
  cost: Omit<ProjectCost, "id">
): Promise<ProjectCost> => {
  await delay(500);
  const newCost: ProjectCost = {
    ...cost,
    id: mockCosts.length + 1,
  };
  mockCosts.push(newCost);
  return newCost;
};

// Servicios para Rentabilidad
export const getProjectProfitability = async (
  projectId: number
): Promise<ProjectProfitability | undefined> => {
  await delay(300);
  return mockProfitability.find((p) => p.projectId === projectId);
};
