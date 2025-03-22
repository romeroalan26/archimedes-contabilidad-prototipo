import { useQuery } from "@tanstack/react-query";
import { fixedAssetService } from "../services/fixedAssetService";
import { FixedAssetSummary as FixedAssetSummaryType } from "../types/fixedAsset.types";

export function FixedAssetSummary() {
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery<FixedAssetSummaryType, Error>({
    queryKey: ["fixedAssetSummary"],
    queryFn: () => fixedAssetService.getSummary(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">
          Error al cargar el resumen: {error.message}
        </p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Activos</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {summary.totalAssets}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Activos registrados</p>
          <p
            className={`mt-2 text-sm ${summary.valueTrend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {summary.valueTrend >= 0 ? "+" : ""}
            {summary.valueTrend}% vs mes anterior
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Valor Total</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              ${summary.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Valor en libros</p>
          <p
            className={`mt-2 text-sm ${summary.valueTrend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {summary.valueTrend >= 0 ? "+" : ""}
            {summary.valueTrend}% vs mes anterior
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Depreciación</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              ${summary.monthlyDepreciation.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Depreciación mensual</p>
          <p
            className={`mt-2 text-sm ${summary.depreciationTrend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {summary.depreciationTrend >= 0 ? "+" : ""}
            {summary.depreciationTrend}% vs mes anterior
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {summary.assetsInMaintenance}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Activos en mantenimiento</p>
        </div>
      </div>
    </div>
  );
}
