import { useState } from "react";
import { Ncf, NcfFilters, NcfStatus, NcfType } from "./types";
import { useUpdateNcfStatus } from "./hooks";

// Mapeo de tipos técnicos a etiquetas amigables
const ncfTypeLabels: Record<NcfType, string> = {
  B01: "B01 - Consumidor Final",
  B02: "B02 - Crédito Fiscal",
  B14: "B14 - Gubernamental",
  B15: "B15 - Régimen Especial",
};

interface NcfListProps {
  ncfList: Ncf[];
  onFiltersChange: (filters: NcfFilters) => void;
}

export default function NcfList({ ncfList, onFiltersChange }: NcfListProps) {
  const [filters, setFilters] = useState<NcfFilters>({});
  const updateStatusMutation = useUpdateNcfStatus();

  const handleAnular = async (id: number) => {
    if (window.confirm("¿Está seguro de que desea anular este comprobante?")) {
      try {
        await updateStatusMutation.mutateAsync({
          id,
          estado: "Anulado" as NcfStatus,
        });
      } catch (error) {
        console.error("Error al anular NCF:", error);
        // TODO: Mostrar notificación de error
      }
    }
  };

  const handleFilterChange = (newFilters: Partial<NcfFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Listado de Comprobantes
      </h2>

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.tipo || ""}
          onChange={(e) =>
            handleFilterChange({
              tipo: (e.target.value as Ncf["tipo"]) || undefined,
            })
          }
        >
          <option value="">Todos los tipos</option>
          <option value="B01">B01 - Consumidor Final</option>
          <option value="B02">B02 - Crédito Fiscal</option>
          <option value="B14">B14 - Gubernamental</option>
          <option value="B15">B15 - Régimen Especial</option>
        </select>

        <select
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.estado || ""}
          onChange={(e) =>
            handleFilterChange({
              estado: (e.target.value as NcfStatus) || undefined,
            })
          }
        >
          <option value="">Todos los estados</option>
          <option value="Emitido">Emitido</option>
          <option value="Anulado">Anulado</option>
          <option value="Enviado">Enviado</option>
          <option value="Rechazado">Rechazado</option>
          <option value="Aceptado">Aceptado</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por cliente..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={filters.cliente || ""}
          onChange={(e) => handleFilterChange({ cliente: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Número
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ncfList.map((ncf) => (
                  <tr key={ncf.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ncfTypeLabels[ncf.tipo]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ncf.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ncf.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(ncf.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${ncf.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ncf.estado === "Emitido"
                            ? "bg-green-100 text-green-800"
                            : ncf.estado === "Anulado"
                              ? "bg-red-100 text-red-800"
                              : ncf.estado === "Enviado"
                                ? "bg-blue-100 text-blue-800"
                                : ncf.estado === "Rechazado"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ncf.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {ncf.estado === "Emitido" && (
                        <button
                          onClick={() => handleAnular(ncf.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Anular
                        </button>
                      )}
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
