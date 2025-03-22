import { Asset } from "./types";

interface AssetListProps {
  assets: Asset[];
}

export default function AssetList({ assets }: AssetListProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-base md:text-lg font-semibold mb-4">
        Listado de Activos Fijos
      </h3>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoría
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {asset.description}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {asset.category}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${asset.currentValue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Original: ${asset.originalValue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          asset.status === "active"
                            ? "bg-green-100 text-green-800"
                            : asset.status === "deprecated"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {asset.status === "active"
                          ? "Activo"
                          : asset.status === "deprecated"
                          ? "Depreciado"
                          : "Disponible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
