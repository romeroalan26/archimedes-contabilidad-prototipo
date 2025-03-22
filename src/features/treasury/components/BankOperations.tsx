import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useBankAccounts,
  useBankOperations,
  useCreateBankOperation,
  useUpdateBankOperationStatus,
} from "../hooks";
import type { BankOperation } from "../types";

interface BankOperationFormData {
  tipo: BankOperation["tipo"];
  bancoId: number;
  monto: number;
  beneficiario: string;
  concepto: string;
  numeroReferencia: string;
}

export function BankOperations() {
  const [showForm, setShowForm] = useState(false);
  const { data: accounts, isLoading: isLoadingAccounts } = useBankAccounts();
  const { data: operations, isLoading: isLoadingOperations } =
    useBankOperations();
  const createOperation = useCreateBankOperation();
  const updateStatus = useUpdateBankOperationStatus();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankOperationFormData>();

  const onSubmit = async (data: BankOperationFormData) => {
    try {
      const newOperation: Omit<BankOperation, "id"> = {
        ...data,
        fecha: new Date().toISOString(),
        estado: "pendiente",
      };
      await createOperation.mutateAsync(newOperation);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear operación:", error);
    }
  };

  const handleStatusUpdate = async (
    id: number,
    estado: BankOperation["estado"]
  ) => {
    try {
      await updateStatus.mutateAsync({ id, estado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (isLoadingAccounts || isLoadingOperations) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Operaciones Bancarias</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Nueva Operación"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              {...register("tipo", { required: "El tipo es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione un tipo</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
              <option value="transferencia">Transferencia</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Banco
            </label>
            <select
              {...register("bancoId", { required: "El banco es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccione un banco</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.banco} - {account.numeroCuenta}
                </option>
              ))}
            </select>
            {errors.bancoId && (
              <p className="text-red-500 text-sm">{errors.bancoId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              {...register("monto", { required: "El monto es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.monto && (
              <p className="text-red-500 text-sm">{errors.monto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Beneficiario
            </label>
            <input
              type="text"
              {...register("beneficiario", {
                required: "El beneficiario es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.beneficiario && (
              <p className="text-red-500 text-sm">
                {errors.beneficiario.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Concepto
            </label>
            <input
              type="text"
              {...register("concepto", {
                required: "El concepto es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.concepto && (
              <p className="text-red-500 text-sm">{errors.concepto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Referencia
            </label>
            <input
              type="text"
              {...register("numeroReferencia", {
                required: "El número de referencia es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.numeroReferencia && (
              <p className="text-red-500 text-sm">
                {errors.numeroReferencia.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={createOperation.isPending}
            >
              {createOperation.isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beneficiario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations?.map((operation) => (
              <tr key={operation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(operation.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {operation.tipo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {accounts?.find((acc) => acc.id === operation.bancoId)?.banco}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {accounts?.find((acc) => acc.id === operation.bancoId)
                    ?.moneda === "USD"
                    ? "US$"
                    : "RD$"}
                  {operation.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {operation.beneficiario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      operation.estado === "completado"
                        ? "bg-green-100 text-green-800"
                        : operation.estado === "pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {operation.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {operation.estado === "pendiente" && (
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(operation.id, "completado")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Completar
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(operation.id, "cancelado")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
