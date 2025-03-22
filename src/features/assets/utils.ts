import { Asset, AssetFormData } from "./types";

export function calculateDepreciation(
  originalValue: number,
  usefulLife: number,
  acquisitionDate: string
): number {
  const today = new Date();
  const acquisition = new Date(acquisitionDate);
  const yearsElapsed =
    (today.getTime() - acquisition.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const annualDepreciation = originalValue / usefulLife;
  const totalDepreciation = annualDepreciation * yearsElapsed;
  return Math.max(0, originalValue - totalDepreciation);
}

export function createNewAsset(formData: AssetFormData): Asset {
  const depreciationRate = (1 / formData.usefulLife) * 100;
  const currentValue = calculateDepreciation(
    formData.originalValue,
    formData.usefulLife,
    formData.acquisitionDate
  );

  return {
    id: Math.random().toString(36).substr(2, 9),
    ...formData,
    currentValue,
    depreciationRate,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
