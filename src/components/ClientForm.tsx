import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client } from "../types/types";
import { useClientStore } from "../stores/clientStore";

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  rnc: z.string().min(1, "El RNC o cédula es obligatorio"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Correo no válido").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  billingType: z.enum(["contado", "credito", "mixto"]),
  ncfType: z.enum([
    "consumidor_final",
    "credito_fiscal",
    "gubernamental",
    "regimen_especial",
  ]),
  status: z.enum(["activo", "inactivo"]).default("activo"),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Client;
  isEdit?: boolean;
  onClose?: () => void;
  onSubmit?: (client: Client) => void;
}

export function ClientForm({
  defaultValues,
  isEdit = false,
  onClose,
  onSubmit: onSubmitProp,
}: ClientFormProps) {
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: defaultValues || {
      name: "",
      rnc: "",
      phone: "",
      email: "",
      address: "",
      billingType: "contado",
      ncfType: "consumidor_final",
      status: "activo",
    },
  });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = (data: ClientFormData) => {
    console.log("Form data submitted:", data);

    const newClient: Client = {
      id: crypto.randomUUID(),
      ...data,
    };

    if (isEdit && defaultValues) {
      const updatedClient = { ...newClient, id: defaultValues.id };
      updateClient(updatedClient);
      onSubmitProp?.(updatedClient);
    } else {
      addClient(newClient);
      onSubmitProp?.(newClient);
    }

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del Cliente *
        </label>
        <input
          {...register("name")}
          type="text"
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.name ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          RNC o Cédula *
        </label>
        <input
          {...register("rnc")}
          type="text"
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.rnc ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.rnc && (
          <span className="text-sm text-red-500">{errors.rnc.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          {...register("phone")}
          type="tel"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          {...register("email")}
          type="email"
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <textarea
          {...register("address")}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Facturación *
        </label>
        <select
          {...register("billingType")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="contado">Contado</option>
          <option value="credito">Crédito</option>
          <option value="mixto">Mixto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de NCF
        </label>
        <select
          {...register("ncfType")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="consumidor_final">01 - Consumidor Final</option>
          <option value="credito_fiscal">02 - Crédito Fiscal</option>
          <option value="gubernamental">14 - Gubernamental</option>
          <option value="regimen_especial">15 - Régimen Especial</option>
        </select>
        {errors.ncfType && (
          <p className="mt-1 text-sm text-red-600">{errors.ncfType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          {...register("status")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {isEdit ? "Actualizar" : "Crear"} Cliente
        </button>
      </div>
    </form>
  );
}
