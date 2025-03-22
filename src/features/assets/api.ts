import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Asset, AssetFormData } from "./types";

// API endpoints (to be replaced with actual endpoints)
const API_BASE_URL = "/api/assets";

// Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API functions
const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch assets");
  return response.json();
};

const createAsset = async (asset: AssetFormData): Promise<Asset> => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(asset),
  });
  if (!response.ok) throw new Error("Failed to create asset");
  return response.json();
};

// React Query hooks
export function useAssets() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
