export interface Asset {
  id: string;
  name: string;
  description: string;
  category: string;
  acquisitionDate: string;
  originalValue: number;
  usefulLife: number; // en años
  currentValue: number;
  depreciationRate: number;
  status: "active" | "deprecated" | "disposed";
}

export interface AssetFormData {
  name: string;
  description: string;
  category: string;
  acquisitionDate: string;
  originalValue: number;
  usefulLife: number;
}
