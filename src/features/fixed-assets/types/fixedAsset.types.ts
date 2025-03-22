export type DepreciationMethod =
  | "straight-line"
  | "declining-balance"
  | "sum-of-years";

export interface FixedAsset {
  id: string;
  name: string;
  description: string;
  acquisitionDate: string;
  cost: number;
  category: string;
  location: string;
  status: "active" | "maintenance" | "retired" | "sold";
  usefulLife: number; // in years
  depreciationMethod: DepreciationMethod;
  provider: string;
  costCenter: string; // obra/centro de costo
  currentValue: number;
  accumulatedDepreciation: number;
  monthlyDepreciation: number;
  lastDepreciationDate: string;
  // TODO: Add fields for maintenance history and transfers
  // maintenanceHistory: MaintenanceRecord[];
  // transferHistory: TransferRecord[];
}

export type FixedAssetFormData = {
  name: string;
  description?: string;
  acquisitionDate: string;
  cost: number;
  category: string;
  location: string;
  status: "active" | "maintenance" | "retired" | "sold";
  usefulLife: number;
  depreciationMethod: DepreciationMethod;
  provider: string;
  costCenter: string;
};

export interface FixedAssetSummary {
  totalAssets: number;
  totalValue: number;
  monthlyDepreciation: number;
  assetsInMaintenance: number;
  depreciationTrend: number;
  valueTrend: number;
}

// TODO: Add interfaces for maintenance and transfer records
// interface MaintenanceRecord {
//   id: string;
//   date: string;
//   type: string;
//   cost: number;
//   description: string;
// }

// interface TransferRecord {
//   id: string;
//   date: string;
//   fromCostCenter: string;
//   toCostCenter: string;
//   reason: string;
// }
