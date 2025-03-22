export type AssetCategory =
  | "equipment"
  | "furniture"
  | "vehicles"
  | "buildings"
  | "other";

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: AssetCategory;
  originalValue: number;
  usefulLife: number;
  acquisitionDate: string;
  currentValue: number;
  depreciationRate: number;
  status: "active" | "deprecated";
  createdAt: string;
  updatedAt: string;
}

export interface AssetFormData {
  name: string;
  description: string;
  category: AssetCategory;
  originalValue: number;
  usefulLife: number;
  acquisitionDate: string;
}
