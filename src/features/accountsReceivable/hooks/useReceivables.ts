import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { receivableService } from "../services/receivableService";
import { UpdateReceivableDTO } from "../types";

export const useReceivables = () => {
  return useQuery({
    queryKey: ["receivables"],
    queryFn: receivableService.list,
  });
};

export const useReceivable = (id: number) => {
  return useQuery({
    queryKey: ["receivables", id],
    queryFn: () => receivableService.getById(id),
    enabled: !!id,
  });
};

export const useReceivableStatus = (customerId: number) => {
  return useQuery({
    queryKey: ["receivables", "status", customerId],
    queryFn: () => receivableService.getStatus(customerId),
    enabled: !!customerId,
  });
};

export const useCreateReceivable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receivableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
    },
  });
};

export const useUpdateReceivable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReceivableDTO }) =>
      receivableService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
      queryClient.invalidateQueries({ queryKey: ["receivables", id] });
    },
  });
};

export const useDeleteReceivable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receivableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receivables"] });
    },
  });
};
