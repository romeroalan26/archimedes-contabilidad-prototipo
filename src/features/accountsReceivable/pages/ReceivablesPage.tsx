import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Customer } from "../types";
import { useReceivables, useCreateReceivable } from "../hooks/useReceivables";
import ReceivablesForm from "../components/ReceivablesForm";
import { formatReceivableStatus } from "../utils/formatters";

// TODO: Replace with actual API calls
const useCustomers = () => {
  return {
    data: [] as Customer[],
    isLoading: false,
    error: null,
  };
};

export default function ReceivablesPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const {
    data: receivables,
    isLoading: isLoadingReceivables,
    error: receivablesError,
  } = useReceivables();

  const {
    data: customers,
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useCustomers();

  const {
    mutate: createReceivable,
    isPending: isCreatingReceivable,
    error: createReceivableError,
  } = useCreateReceivable();

  const handleCreateReceivable = async (formData: any) => {
    try {
      await createReceivable(formData);
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear el ingreso:", error);
    }
  };

  if (isLoadingReceivables || isLoadingCustomers) {
    return <div>Cargando...</div>;
  }

  if (receivablesError || customersError) {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Cuentas por Cobrar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Nuevo Ingreso"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ReceivablesForm
            customers={customers || []}
            onSubmit={handleCreateReceivable}
            isLoading={isCreatingReceivable}
            error={createReceivableError}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {receivables?.map((receivable) => (
              <tr key={receivable.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {receivable.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(receivable.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {
                    customers?.find((c) => c.id === receivable.customerId)
                      ?.nombre
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${receivable.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      receivable.estado === "PAID"
                        ? "bg-green-100 text-green-800"
                        : receivable.estado === "OVERDUE"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {formatReceivableStatus(receivable.estado)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/receivables/${receivable.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
