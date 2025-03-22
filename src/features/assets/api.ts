import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Asset, AssetFormData } from "./types";
import { mockAssets } from "./mockData";
import { createNewAsset } from "./utils";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simular error aleatorio (20% de probabilidad)
const simulateError = () => {
  if (Math.random() < 0.2) {
    throw new Error("Error de conexión simulado");
  }
};

// API endpoints (to be replaced with actual endpoints)
const API_BASE_URL = "/api/assets";

// Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API functions
const fetchAssets = async (): Promise<Asset[]> => {
  await delay(500);
  simulateError();
  return mockAssets;
};

const createAsset = async (asset: AssetFormData): Promise<Asset> => {
  await delay(800);
  simulateError();
  const newAsset = createNewAsset(asset);
  mockAssets.push(newAsset);
  return newAsset;
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
