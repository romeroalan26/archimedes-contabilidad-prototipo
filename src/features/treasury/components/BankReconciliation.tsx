import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useBankAccounts,
  useReconciliations,
  useCreateReconciliation,
  useUpdateReconciliationStatus,
} from "../hooks";
import type { BankReconciliation } from "../types";

interface ReconciliationFormData {
  bancoId: number;
  fechaInicio: string;
  fechaFin: string;
  saldoInicial: number;
  saldoFinal: number;
}

export function BankReconciliation() {
  const [showForm, setShowForm] = useState(false);
  const { data: accounts, isLoading: isLoadingAccounts } = useBankAccounts();
  const { data: reconciliations, isLoading: isLoadingReconciliations } =
    useReconciliations();
  const createReconciliation = useCreateReconciliation();
  const updateStatus = useUpdateReconciliationStatus();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReconciliationFormData>();

  const onSubmit = async (data: ReconciliationFormData) => {
    try {
      const newReconciliation: Omit<BankReconciliation, "id"> = {
        ...data,
        operacionesConciliadas: [],
        estado: "pendiente",
      };
      await createReconciliation.mutateAsync(newReconciliation);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear conciliación:", error);
    }
  };

  const handleStatusUpdate = async (
    id: number,
    estado: BankReconciliation["estado"]
  ) => {
    try {
      await updateStatus.mutateAsync({ id, estado });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  if (isLoadingAccounts || isLoadingReconciliations) {
    return <div className="text-gray-900 dark:text-gray-100">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Conciliación Bancaria
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          {showForm ? "Cancelar" : "Nueva Conciliación"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Banco
            </label>
            <select
              {...register("bancoId", { required: "El banco es requerido" })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="">Seleccione un banco</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.banco} - {account.numeroCuenta}
                </option>
              ))}
            </select>
            {errors.bancoId && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.bancoId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha Inicio
            </label>
            <input
              type="date"
              {...register("fechaInicio", {
                required: "La fecha de inicio es requerida",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.fechaInicio && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.fechaInicio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha Fin
            </label>
            <input
              type="date"
              {...register("fechaFin", {
                required: "La fecha fin es requerida",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.fechaFin && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.fechaFin.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Saldo Inicial
            </label>
            <input
              type="number"
              step="0.01"
              {...register("saldoInicial", {
                required: "El saldo inicial es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.saldoInicial && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.saldoInicial.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Saldo Final
            </label>
            <input
              type="number"
              step="0.01"
              {...register("saldoFinal", {
                required: "El saldo final es requerido",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.saldoFinal && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.saldoFinal.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
              disabled={createReconciliation.isPending}
            >
              {createReconciliation.isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Banco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Saldo Inicial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Saldo Final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Operaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {reconciliations?.map((reconciliation) => (
              <tr
                key={reconciliation.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {
                    accounts?.find((acc) => acc.id === reconciliation.bancoId)
                      ?.banco
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {new Date(reconciliation.fechaInicio).toLocaleDateString()} -{" "}
                  {new Date(reconciliation.fechaFin).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {accounts?.find((acc) => acc.id === reconciliation.bancoId)
                    ?.moneda === "USD"
                    ? "US$"
                    : "RD$"}
                  {reconciliation.saldoInicial.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {accounts?.find((acc) => acc.id === reconciliation.bancoId)
                    ?.moneda === "USD"
                    ? "US$"
                    : "RD$"}
                  {reconciliation.saldoFinal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {reconciliation.operacionesConciliadas.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      reconciliation.estado === "conciliado"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : reconciliation.estado === "pendiente"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {reconciliation.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {reconciliation.estado === "pendiente" && (
                    <div className="space-x-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(reconciliation.id, "conciliado")
                        }
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        Completar
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(reconciliation.id, "discrepancia")
                        }
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
