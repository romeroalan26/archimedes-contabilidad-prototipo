import { DepreciationMethod } from "../types/fixedAsset.types";

export function calculateMonthlyDepreciation(
  cost: number,
  usefulLife: number,
  method: DepreciationMethod = "straight-line"
): number {
  switch (method) {
    case "straight-line":
      return cost / (usefulLife * 12);
    case "declining-balance":
      // TODO: Implement declining balance method
      return cost / (usefulLife * 12);
    case "sum-of-years":
      // TODO: Implement sum of years method
      return cost / (usefulLife * 12);
    default:
      return cost / (usefulLife * 12);
  }
}

export function calculateAccumulatedDepreciation(
  monthlyDepreciation: number,
  acquisitionDate: string,
  lastDepreciationDate: string
): number {
  const startDate = new Date(acquisitionDate);
  const endDate = new Date(lastDepreciationDate);
  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  return monthlyDepreciation * monthsDiff;
}

export function calculateCurrentValue(
  cost: number,
  accumulatedDepreciation: number
): number {
  return Math.max(0, cost - accumulatedDepreciation);
}

// TODO: Implement accounting entries for depreciation
/*
export function generateDepreciationEntry(
  asset: FixedAsset,
  depreciationAmount: number
): AccountingEntry {
  return {
    date: new Date(),
    entries: [
      {
        account: 'Depreciation Expense',
        debit: depreciationAmount,
        credit: 0,
        description: `Monthly depreciation for ${asset.name}`
      },
      {
        account: 'Accumulated Depreciation',
        debit: 0,
        credit: depreciationAmount,
        description: `Monthly depreciation for ${asset.name}`
      }
    ]
  };
}
*/
