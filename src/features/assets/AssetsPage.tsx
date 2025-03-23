import { useAssets, useCreateAsset } from "./api";
import { AssetFormData } from "./types";
import AssetForm from "./AssetForm";
import AssetList from "./AssetList";

export default function AssetsPage() {
  const { data: assets = [], isLoading, error } = useAssets();
  const createAssetMutation = useCreateAsset();

  const handleNewAsset = async (formData: AssetFormData) => {
    try {
      await createAssetMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error creating asset:", error);
      // TODO: Show error notification
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando activos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-700 text-center">
            Error al cargar los activos. Por favor, intente nuevamente.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestión de Activos Fijos
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Registrar Nuevo Activo
          </h2>
          <AssetForm
            onSubmit={handleNewAsset}
            isLoading={createAssetMutation.isPending}
          />
        </div>
        <div>
          <AssetList assets={assets} />
        </div>
      </div>
    </div>
  );
}
