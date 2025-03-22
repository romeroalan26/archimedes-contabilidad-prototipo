import { useState } from "react";
import { FixedAssetForm } from "./FixedAssetForm.tsx";
import { FixedAssetList } from "./FixedAssetList.tsx";
import { FixedAssetSummary } from "./FixedAssetSummary.tsx";

export function FixedAssetsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Activos Fijos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          {showForm ? "Cancelar" : "Nuevo Activo"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FixedAssetForm />
        </div>
      )}

      <div className="space-y-6">
        <FixedAssetSummary />
        <FixedAssetList />
      </div>
    </div>
  );
}
