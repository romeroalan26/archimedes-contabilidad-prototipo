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
  billingType: z.enum(["contado", "credito", "mixto"]),
  ncfType: z.enum(["final", "fiscal", "gubernamental", "especial"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  defaultValues?: Client;
  isEdit?: boolean;
  onClose?: () => void;
}

export function ClientForm({
  defaultValues,
  isEdit = false,
  onClose,
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
      billingType: "contado",
      ncfType: "final",
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
      updateClient({ ...newClient, id: defaultValues.id });
    } else {
      addClient(newClient);
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
          Tipo de NCF *
        </label>
        <select
          {...register("ncfType")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="final">Final</option>
          <option value="fiscal">Fiscal</option>
          <option value="gubernamental">Gubernamental</option>
          <option value="especial">Especial</option>
        </select>
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
