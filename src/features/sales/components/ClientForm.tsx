import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Client } from "../types";
import { saveClient } from "../../../services/clients/saveClient";

// Esquema de validación con Zod
export const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  rnc: z.string().min(1, "El RNC o cédula es obligatorio"),
  phone: z.string().optional(),
  email: z.string().email("Correo no válido").optional(),
  billingType: z.enum(["contado", "credito", "mixto"]),
  ncfType: z.enum(["final", "fiscal", "gubernamental", "especial"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Partial<Client>;
  onSubmit: (data: ClientFormData) => void;
  isEdit?: boolean;
  onSuccess?: () => void;
}

export default function ClientForm({
  defaultValues,
  onSubmit,
  isEdit = false,
  onSuccess,
}: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      rnc: defaultValues?.rnc || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",
      billingType: defaultValues?.billingType || "contado",
      ncfType: defaultValues?.ncfType || "final",
    },
  });

  // Autofoco en el campo de nombre al abrir el formulario
  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  // Scroll al primer error al intentar enviar
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Preparar el cliente para enviar a la API
      const clientToSave: Client = {
        ...data,
        id: defaultValues?.id || crypto.randomUUID(),
      };

      // Llamar al servicio para guardar el cliente
      await saveClient(clientToSave, isEdit);

      // Mostrar mensaje de éxito
      setSuccessMessage(
        isEdit
          ? "Cliente actualizado correctamente"
          : "Cliente creado correctamente"
      );

      // Resetear el formulario si no es edición
      if (!isEdit) {
        reset();
      }

      // Llamar al callback de éxito si existe
      onSuccess?.();

      // Llamar al onSubmit original
      onSubmit(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ha ocurrido un error al guardar el cliente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Mensajes de feedback */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre o Razón Social
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className={`mt-1 block w-full rounded-md border ${
            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          placeholder="Ingrese el nombre o razón social"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="rnc"
          className="block text-sm font-medium text-gray-700"
        >
          RNC o Cédula
        </label>
        <input
          type="text"
          id="rnc"
          {...register("rnc")}
          className={`mt-1 block w-full rounded-md border ${
            errors.rnc
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          placeholder="Ingrese el RNC o cédula"
          disabled={isLoading}
        />
        {errors.rnc && (
          <p className="mt-1 text-sm text-red-600">{errors.rnc.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Teléfono
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          className={`mt-1 block w-full rounded-md border ${
            errors.phone
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          placeholder="(809) 555-0123"
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className={`mt-1 block w-full rounded-md border ${
            errors.email
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          placeholder="ejemplo@dominio.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="billingType"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Facturación
        </label>
        <select
          id="billingType"
          {...register("billingType")}
          className={`mt-1 block w-full rounded-md border ${
            errors.billingType
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          disabled={isLoading}
        >
          <option value="contado">Contado</option>
          <option value="credito">Crédito</option>
          <option value="mixto">Mixto</option>
        </select>
        {errors.billingType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.billingType.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="ncfType"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de NCF
        </label>
        <select
          id="ncfType"
          {...register("ncfType")}
          className={`mt-1 block w-full rounded-md border ${
            errors.ncfType
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          } shadow-sm p-2`}
          disabled={isLoading}
        >
          <option value="final">Final</option>
          <option value="fiscal">Fiscal</option>
          <option value="gubernamental">Gubernamental</option>
          <option value="especial">Especial</option>
        </select>
        {errors.ncfType && (
          <p className="mt-1 text-sm text-red-600">{errors.ncfType.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {isEdit ? "Actualizar Cliente" : "Crear Cliente"}
        </button>
      </div>
    </form>
  );
}
