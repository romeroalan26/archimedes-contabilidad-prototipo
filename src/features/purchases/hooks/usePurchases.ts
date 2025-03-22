import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../services/purchaseService";
import { CreatePurchaseDTO, UpdatePurchaseDTO } from "../types";

export const usePurchases = () => {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: purchaseService.list,
  });
};

export const usePurchase = (id: number) => {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => purchaseService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseDTO) => purchaseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePurchaseDTO }) =>
      purchaseService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["purchase", id] });
    },
  });
};

export const useDeletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => purchaseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};
