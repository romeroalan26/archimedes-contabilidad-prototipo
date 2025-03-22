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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando activos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error al cargar los activos. Por favor, intente nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 pl-12 md:pl-0">
        Gestión de Activos Fijos
      </h1>
      <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
        <div className="w-full">
          <AssetForm
            onSubmit={handleNewAsset}
            isLoading={createAssetMutation.isPending}
          />
        </div>
        <div className="w-full">
          <AssetList assets={assets} />
        </div>
      </div>
    </div>
  );
}
