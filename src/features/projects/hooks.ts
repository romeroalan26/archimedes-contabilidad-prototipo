import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  getProjectResources,
  getProjectCosts,
  getProjectProfitability,
} from "./services";
import type { Project } from "./types";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
  });
};

export const useProjectResources = (projectId: number) => {
  return useQuery({
    queryKey: ["project-resources", projectId],
    queryFn: () => getProjectResources(projectId),
    enabled: !!projectId,
  });
};

export const useProjectCosts = (projectId: number) => {
  return useQuery({
    queryKey: ["project-costs", projectId],
    queryFn: () => getProjectCosts(projectId),
    enabled: !!projectId,
  });
};

export const useProjectProfitability = (projectId: number) => {
  return useQuery({
    queryKey: ["project-profitability", projectId],
    queryFn: () => getProjectProfitability(projectId),
    enabled: !!projectId,
  });
};
