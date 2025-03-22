import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";

export function useDeleteFixedAsset() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => fixedAssetService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["fixedAssets"] });
      queryClient.invalidateQueries({ queryKey: ["fixedAsset", id] });
    },
  });
}
