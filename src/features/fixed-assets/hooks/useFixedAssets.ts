import { useQuery } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";
import { FixedAsset } from "../types/fixedAsset.types";

export function useFixedAssets() {
  return useQuery<FixedAsset[], Error>({
    queryKey: ["fixedAssets"],
    queryFn: () => fixedAssetService.list(),
  });
}
