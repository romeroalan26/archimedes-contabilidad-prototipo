import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NcfFormData, NcfFilters, NcfStatus } from "./types";
import {
  getNcfList,
  getNcfById,
  createNcf,
  updateNcfStatus,
  syncWithDgii,
} from "./services";

export function useNcfList(filters?: NcfFilters) {
  return useQuery({
    queryKey: ["ncf-list", filters],
    queryFn: () => getNcfList(filters),
  });
}

export function useNcfById(id: number) {
  return useQuery({
    queryKey: ["ncf", id],
    queryFn: () => getNcfById(id),
    enabled: !!id,
  });
}

export function useCreateNcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNcf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ncf-list"] });
    },
  });
}

export function useUpdateNcfStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: NcfStatus }) =>
      updateNcfStatus(id, estado),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ncf-list"] });
      queryClient.invalidateQueries({ queryKey: ["ncf", id] });
    },
  });
}

export function useSyncWithDgii() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncWithDgii,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["ncf-list"] });
      queryClient.invalidateQueries({ queryKey: ["ncf", id] });
    },
  });
}
