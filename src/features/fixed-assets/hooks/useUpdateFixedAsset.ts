import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";
import { FixedAsset, FixedAssetFormData } from "../types/fixedAsset.types";

export function useUpdateFixedAsset() {
  const queryClient = useQueryClient();

  return useMutation<
    FixedAsset | null,
    Error,
    { id: string; data: FixedAssetFormData }
  >({
    mutationFn: ({ id, data }) => fixedAssetService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fixedAssets"] });
      queryClient.invalidateQueries({ queryKey: ["fixedAsset", variables.id] });
    },
  });
}
