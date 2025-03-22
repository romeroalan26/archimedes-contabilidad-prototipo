import { useQuery } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";
import { FixedAsset } from "../types/fixedAsset.types";

export function useFixedAssetDetails(id: string) {
  return useQuery<FixedAsset | null, Error>({
    queryKey: ["fixedAsset", id],
    queryFn: () => fixedAssetService.getById(id),
    enabled: !!id,
  });
}
