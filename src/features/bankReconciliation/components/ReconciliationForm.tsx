import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateReconciliationDTO } from "../types";
import { useCreateReconciliation } from "../hooks/useReconciliation";

const reconciliationSchema = z.object({
  bankId: z.string().min(1, "Banco es requerido"),
  month: z.number().min(1).max(12, "Mes debe estar entre 1 y 12"),
  year: z.number().min(2000).max(new Date().getFullYear(), "Año no válido"),
  bankBalance: z.number().min(0, "Balance debe ser mayor a 0"),
});

type ReconciliationFormData = z.infer<typeof reconciliationSchema>;

interface ReconciliationFormProps {
  onSuccess?: () => void;
}

export const ReconciliationForm: React.FC<ReconciliationFormProps> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReconciliationFormData>({
    resolver: zodResolver(reconciliationSchema),
  });

  const createReconciliation = useCreateReconciliation();

  const onSubmit = async (data: ReconciliationFormData) => {
    try {
      await createReconciliation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating reconciliation:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="bankId"
          className="block text-sm font-medium text-gray-700"
        >
          Banco
        </label>
        <select
          id="bankId"
          {...register("bankId")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Seleccione un banco</option>
          {/* TODO: Add bank options */}
        </select>
        {errors.bankId && (
          <p className="mt-1 text-sm text-red-600">{errors.bankId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="month"
            className="block text-sm font-medium text-gray-700"
          >
            Mes
          </label>
          <select
            id="month"
            {...register("month", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString("es-ES", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="mt-1 text-sm text-red-600">{errors.month.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Año
          </label>
          <input
            type="number"
            id="year"
            {...register("year", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={new Date().getFullYear()}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="bankBalance"
          className="block text-sm font-medium text-gray-700"
        >
          Balance en Banco
        </label>
        <input
          type="number"
          id="bankBalance"
          step="0.01"
          {...register("bankBalance", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.bankBalance && (
          <p className="mt-1 text-sm text-red-600">
            {errors.bankBalance.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Creando..." : "Crear Conciliación"}
        </button>
      </div>
    </form>
  );
};
