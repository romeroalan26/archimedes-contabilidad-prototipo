import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBankAccounts, useCashFlow, useCreateCashFlowEntry } from "../hooks";
import type { CashFlowEntry } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CashFlowFormData {
  tipo: CashFlowEntry["tipo"];
  monto: number;
  concepto: string;
  categoria: string;
  bancoId: number;
}

export function CashFlow() {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data: accounts, isLoading: isLoadingAccounts } = useBankAccounts();
  const { data: entries, isLoading: isLoadingEntries } = useCashFlow(
    startDate,
    endDate
  );
  const createEntry = useCreateCashFlowEntry();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashFlowFormData>();

  const onSubmit = async (data: CashFlowFormData) => {
    try {
      const newEntry: Omit<CashFlowEntry, "id"> = {
        ...data,
        fecha: new Date().toISOString(),
      };
      await createEntry.mutateAsync(newEntry);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear entrada:", error);
    }
  };

  if (isLoadingAccounts || isLoadingEntries) {
    return <div>Cargando...</div>;
  }

  const chartData = entries?.map((entry) => ({
    fecha: new Date(entry.fecha).toLocaleDateString(),
    monto: entry.tipo === "ingreso" ? entry.monto : -entry.monto,
  }));

  const totalIngresos =
    entries?.reduce(
      (sum, entry) => sum + (entry.tipo === "ingreso" ? entry.monto : 0),
      0
    ) || 0;
  const totalEgresos =
    entries?.reduce(
      (sum, entry) => sum + (entry.tipo === "egreso" ? entry.monto : 0),
      0
    ) || 0;
  const balance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Flujo de Caja</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Cancelar" : "Nueva Entrada"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Ingresos
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {accounts?.[0]?.moneda === "USD" ? "US$" : "RD$"}
            {totalIngresos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Egresos</h3>
          <p className="text-2xl font-bold text-red-600">
            {accounts?.[0]?.moneda === "USD" ? "US$" : "RD$"}
            {totalEgresos.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {accounts?.[0]?.moneda === "USD" ? "US$" : "RD$"}
            {balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="monto"
                stroke="#3B82F6"
                name="Balance"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
              Categoría
            </label>
            <input
              type="text"
              {...register("categoria", {
                required: "La categoría es requerida",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.categoria && (
              <p className="text-red-500 text-sm">{errors.categoria.message}</p>
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
              disabled={createEntry.isPending}
            >
              {createEntry.isPending ? "Guardando..." : "Guardar"}
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
                Concepto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries?.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(entry.fecha).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      entry.tipo === "ingreso"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {accounts?.find((acc) => acc.id === entry.bancoId)?.banco}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {accounts?.find((acc) => acc.id === entry.bancoId)?.moneda ===
                  "USD"
                    ? "US$"
                    : "RD$"}
                  {entry.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.concepto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.categoria}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
