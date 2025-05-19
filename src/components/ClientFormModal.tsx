import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Client } from "../types/types";
import { useClientStore } from "../stores/clientStore";
import { clientService } from "../services/clients/clientService";

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

interface ClientFormModalProps {
  defaultValues?: Client;
  isEdit?: boolean;
  onClose: () => void;
  onSubmit?: (client: Client) => void;
}

export function ClientFormModal({
  defaultValues,
  isEdit = false,
  onClose,
  onSubmit: onSubmitProp,
}: ClientFormModalProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "additional">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setFocus,
    watch,
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
    mode: "onChange",
  });

  // Ver los valores del formulario en tiempo real para mostrar en la vista previa
  const formValues = watch();

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Form data submitted:", data);

      if (isEdit && defaultValues) {
        // Actualizar cliente existente
        const updatedClient = await clientService.update(
          defaultValues.id,
          data
        );
        updateClient(updatedClient); // Actualizar en el store local
        onSubmitProp?.(updatedClient);
      } else {
        // Crear nuevo cliente
        const newClient = await clientService.create(data);
        addClient(newClient); // Agregar al store local
        onSubmitProp?.(newClient);
      }

      onClose();
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);

      // Verificar si el error está relacionado con el empresa_id
      if (
        error.response?.data?.includes("empresa_id") ||
        error.message?.includes("empresa_id")
      ) {
        alert(
          "Error: No se ha configurado el ID de empresa. Por favor, contacte al administrador del sistema."
        );
      } else {
        alert("Error al guardar el cliente. Por favor intente nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Encabezado */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Actualice los datos del cliente"
                : "Complete los datos para crear un nuevo cliente"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full max-h-[calc(90vh-6rem)]">
          {/* Contenido principal */}
          <div className="md:w-2/3 p-6 overflow-y-auto">
            {/* Pestañas */}
            <div className="mb-6 border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`py-2 px-1 font-medium text-sm border-b-2 ${
                    activeTab === "basic"
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Información Básica
                </button>
                <button
                  onClick={() => setActiveTab("additional")}
                  className={`py-2 px-1 font-medium text-sm border-b-2 ${
                    activeTab === "additional"
                      ? "text-indigo-600 border-indigo-600"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Información Adicional
                </button>
              </div>
            </div>

            <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
              {/* Campos básicos */}
              {activeTab === "basic" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Cliente{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        className={`block w-full rounded-md shadow-sm text-sm ${
                          errors.name
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        placeholder="Nombre completo o razón social"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        RNC o Cédula <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("rnc")}
                        type="text"
                        className={`block w-full rounded-md shadow-sm text-sm ${
                          errors.rnc
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        }`}
                        placeholder="Número de RNC o cédula"
                      />
                      {errors.rnc && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.rnc.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <input
                          {...register("phone")}
                          type="tel"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="809-555-5555"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                          </svg>
                        </div>
                        <input
                          {...register("email")}
                          type="email"
                          className={`pl-10 block w-full rounded-md shadow-sm text-sm ${
                            errors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          }`}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <textarea
                        {...register("address")}
                        rows={2}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Calle, número, sector, ciudad, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos adicionales */}
              {activeTab === "additional" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Facturación{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("billingType")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="contado">Contado</option>
                        <option value="credito">Crédito</option>
                        <option value="mixto">Mixto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de NCF <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("ncfType")}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="consumidor_final">
                          01 - Consumidor Final
                        </option>
                        <option value="credito_fiscal">
                          02 - Crédito Fiscal
                        </option>
                        <option value="gubernamental">
                          14 - Gubernamental
                        </option>
                        <option value="regimen_especial">
                          15 - Régimen Especial
                        </option>
                      </select>
                      {errors.ncfType && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.ncfType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          {...register("status")}
                          id="status-active"
                          type="radio"
                          value="activo"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="status-active"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Activo
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register("status")}
                          id="status-inactive"
                          type="radio"
                          value="inactivo"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="status-inactive"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Inactivo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Panel lateral con vista previa y controles */}
          <div className="md:w-1/3 bg-gray-50 p-6 border-l overflow-y-auto">
            <div className="space-y-6">
              {/* Vista previa del cliente */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Vista Previa
                </h3>
                <div className="bg-white rounded-lg border p-4 shadow-sm">
                  <h4 className="font-medium text-gray-900">
                    {formValues.name || "Nombre del Cliente"}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    RNC: {formValues.rnc || "000-0000000-0"}
                  </p>
                  {formValues.phone && (
                    <p className="text-sm text-gray-500 mt-1">
                      Tel: {formValues.phone}
                    </p>
                  )}
                  {formValues.email && (
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      Email: {formValues.email}
                    </p>
                  )}
                  {formValues.address && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      Dir: {formValues.address}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {formValues.billingType === "contado"
                        ? "Contado"
                        : formValues.billingType === "credito"
                          ? "Crédito"
                          : "Mixto"}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {formValues.ncfType === "consumidor_final"
                        ? "01 - Consumidor Final"
                        : formValues.ncfType === "credito_fiscal"
                          ? "02 - Crédito Fiscal"
                          : formValues.ncfType === "gubernamental"
                            ? "14 - Gubernamental"
                            : "15 - Régimen Especial"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        formValues.status === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formValues.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controles */}
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  form="client-form"
                  disabled={isSubmitting || (!isDirty && isEdit)}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting || (!isDirty && isEdit)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Guardando...
                    </>
                  ) : isEdit ? (
                    "Actualizar Cliente"
                  ) : (
                    "Crear Cliente"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
              </div>

              {/* Indicadores de campos obligatorios */}
              <div className="text-xs text-gray-500">
                <span className="text-red-500">*</span> Campo obligatorio
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
