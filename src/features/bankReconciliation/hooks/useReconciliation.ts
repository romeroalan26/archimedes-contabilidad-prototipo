import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reconciliationService } from "../services/reconciliationService";
import {
  CreateReconciliationDTO,
  UpdateReconciliationDTO,
  ReconciliationFilters,
} from "../types";

export const useReconciliations = (filters?: ReconciliationFilters) => {
  return useQuery({
    queryKey: ["reconciliations", filters],
    queryFn: () => reconciliationService.getReconciliations(filters),
  });
};

export const useReconciliationById = (id: string) => {
  return useQuery({
    queryKey: ["reconciliation", id],
    queryFn: () => reconciliationService.getReconciliationById(id),
    enabled: !!id,
  });
};

export const useCreateReconciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReconciliationDTO) =>
      reconciliationService.createReconciliation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliations"] });
    },
  });
};

export const useUpdateReconciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReconciliationDTO }) =>
      reconciliationService.updateReconciliation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reconciliations"] });
      queryClient.invalidateQueries({ queryKey: ["reconciliation", id] });
    },
  });
};

export const useDeleteReconciliation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reconciliationService.deleteReconciliation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliations"] });
    },
  });
};
