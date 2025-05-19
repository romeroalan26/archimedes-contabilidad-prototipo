import {
  FixedAsset,
  FixedAssetFormData,
  FixedAssetSummary,
} from "../types/fixedAsset.types";
import {
  calculateMonthlyDepreciation,
  calculateCurrentValue,
} from "../utils/depreciation";

// Simulated data store
let assets: FixedAsset[] = [
  {
    id: "1",
    name: "Laptop Dell XPS",
    description: "Laptop para desarrollo",
    acquisitionDate: "2024-01-15",
    cost: 1500,
    category: "equipment",
    location: "Oficina Principal",
    status: "active",
    usefulLife: 3,
    depreciationMethod: "straight-line",
    provider: "Dell Inc.",
    costCenter: "Desarrollo",
    currentValue: 1500,
    accumulatedDepreciation: 0,
    monthlyDepreciation: calculateMonthlyDepreciation(1500, 3),
    lastDepreciationDate: "2024-01-15",
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fixedAssetService = {
  // TODO: Replace with actual API calls
  async list(): Promise<FixedAsset[]> {
    await delay(500);
    return assets;
  },

  async getById(id: string): Promise<FixedAsset | null> {
    await delay(300);
    return assets.find((asset) => asset.id === id) || null;
  },

  async create(data: FixedAssetFormData): Promise<FixedAsset> {
    await delay(500);
    const newAsset: FixedAsset = {
      ...data,
      description: data.description || "",
      id: Math.random().toString(36).substr(2, 9),
      currentValue: data.cost,
      accumulatedDepreciation: 0,
      monthlyDepreciation: calculateMonthlyDepreciation(
        data.cost,
        data.usefulLife,
        data.depreciationMethod
      ),
      lastDepreciationDate: data.acquisitionDate,
    };
    assets.push(newAsset);
    return newAsset;
  },

  async update(
    id: string,
    data: FixedAssetFormData
  ): Promise<FixedAsset | null> {
    await delay(500);
    const index = assets.findIndex((asset) => asset.id === id);
    if (index === -1) return null;

    const updatedAsset: FixedAsset = {
      ...assets[index],
      ...data,
      currentValue: calculateCurrentValue(
        data.cost,
        assets[index].accumulatedDepreciation
      ),
      monthlyDepreciation: calculateMonthlyDepreciation(
        data.cost,
        data.usefulLife,
        data.depreciationMethod
      ),
    };
    assets[index] = updatedAsset;
    return updatedAsset;
  },

  async delete(id: string): Promise<boolean> {
    await delay(500);
    const index = assets.findIndex((asset) => asset.id === id);
    if (index === -1) return false;
    assets.splice(index, 1);
    return true;
  },

  async getSummary(): Promise<FixedAssetSummary> {
    await delay(300);
    const totalAssets = assets.length;
    const totalValue = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0
    );
    const monthlyDepreciation = assets.reduce(
      (sum, asset) => sum + asset.monthlyDepreciation,
      0
    );
    const assetsInMaintenance = assets.filter(
      (asset) => asset.status === "maintenance"
    ).length;

    return {
      totalAssets,
      totalValue,
      monthlyDepreciation,
      assetsInMaintenance,
      depreciationTrend: 0, // TODO: Calculate trend
      valueTrend: 0, // TODO: Calculate trend
    };
  },
};
