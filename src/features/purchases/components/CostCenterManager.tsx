import { useState } from "react";
import { useForm } from "react-hook-form";
import { CostCenter, useCostCenterStore } from "../stores/costCenterStore";

interface CostCenterFormData {
  codigo: string;
  nombre: string;
  tipo: CostCenter["tipo"];
}

export default function CostCenterManager() {
  const { costCenters, addCostCenter, updateCostCenter } = useCostCenterStore();
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(
    null
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CostCenterFormData>({
    defaultValues: {
      codigo: "",
      nombre: "",
      tipo: "egreso",
    },
  });

  const onSubmit = (data: CostCenterFormData) => {
    if (editingCostCenter) {
      updateCostCenter({
        ...editingCostCenter,
        ...data,
      });
      setEditingCostCenter(null);
    } else {
      addCostCenter({
        ...data,
        id: 0, // Will be set by the store
        saldo: 0,
      });
    }
    reset();
  };

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
    reset({
      codigo: costCenter.codigo,
      nombre: costCenter.nombre,
      tipo: costCenter.tipo,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">
          {editingCostCenter ? "Editar" : "Nuevo"} Centro de Costo
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código *
            </label>
            <input
              type="text"
              {...register("codigo", { required: "El código es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.codigo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.codigo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              type="text"
              {...register("nombre", { required: "El nombre es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Cuenta *
            </label>
            <select
              {...register("tipo", { required: "El tipo es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="activo">Activo</option>
              <option value="pasivo">Pasivo</option>
              <option value="capital">Capital</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            {editingCostCenter && (
              <button
                type="button"
                onClick={() => {
                  setEditingCostCenter(null);
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingCostCenter ? "Actualizar" : "Crear"} Centro de Costo
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Centros de Costo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costCenters.map((costCenter) => (
                <tr key={costCenter.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {costCenter.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {costCenter.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {costCenter.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costCenter.saldo.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(costCenter)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
