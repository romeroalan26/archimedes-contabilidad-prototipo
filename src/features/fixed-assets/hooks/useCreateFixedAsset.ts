import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";
import { FixedAsset, FixedAssetFormData } from "../types/fixedAsset.types";

export function useCreateFixedAsset() {
  const queryClient = useQueryClient();

  return useMutation<FixedAsset, Error, FixedAssetFormData>({
    mutationFn: (data) => fixedAssetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedAssets"] });
    },
  });
}
