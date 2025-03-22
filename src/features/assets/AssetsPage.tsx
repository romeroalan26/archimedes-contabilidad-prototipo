import { useState } from "react";
import { Asset, AssetFormData } from "./types";
import { mockAssets } from "./mockData";
import { createNewAsset } from "./utils";
import AssetForm from "./AssetForm";
import AssetList from "./AssetList";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);

  const handleNewAsset = (formData: AssetFormData) => {
    const newAsset = createNewAsset(formData);
    setAssets([...assets, newAsset]);
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 pl-12 md:pl-0">
        Gestión de Activos Fijos
      </h1>
      <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
        <div className="w-full">
          <AssetForm onSubmit={handleNewAsset} />
        </div>
        <div className="w-full">
          <AssetList assets={assets} />
        </div>
      </div>
    </div>
  );
}
