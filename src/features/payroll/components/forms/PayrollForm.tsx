import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreatePayroll } from "../../hooks";
import { useCalculoNominaRD } from "../../hooks/usePayrollCalculations";
import { calculatePayrollNet } from "../../utils/calculations";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/format";

const payrollSchema = z.object({
  empleadoId: z.number().min(1, "Debe seleccionar un empleado"),
  periodo: z
    .object({
      inicio: z.string().min(1, "La fecha de inicio es requerida"),
      fin: z.string().min(1, "La fecha de fin es requerida"),
      fechaPago: z.string().min(1, "La fecha de pago es requerida"),
    })
    .refine((data) => new Date(data.inicio) < new Date(data.fin), {
      message: "La fecha de inicio debe ser anterior a la fecha de fin",
    }),
  salarioBase: z.number().min(0, "El salario base debe ser mayor o igual a 0"),
  bonificaciones: z.array(
    z.object({
      tipo: z.enum(["horasExtra", "comision", "otro"]),
      monto: z.number().min(0, "El monto debe ser mayor o igual a 0"),
      descripcion: z.string().min(1, "La descripción es requerida"),
    })
  ),
  deducciones: z.array(
    z.object({
      tipo: z.enum(["prestamo", "adelanto", "otro"]),
      monto: z.number().min(0, "El monto debe ser mayor o igual a 0"),
      descripcion: z.string().min(1, "La descripción es requerida"),
    })
  ),
});

type PayrollFormData = z.infer<typeof payrollSchema>;

export function PayrollForm() {
  const createPayroll = useCreatePayroll();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      bonificaciones: [],
      deducciones: [],
    },
  });

  const salarioBase = watch("salarioBase") || 0;
  const calculo = useCalculoNominaRD(salarioBase);

  const onSubmit = async (data: PayrollFormData) => {
    try {
      const now = new Date().toISOString();
      const netSalary = calculatePayrollNet(
        data.salarioBase,
        data.bonificaciones,
        data.deducciones
      );

      const payrollData = {
        ...data,
        ...calculo,
        afp: calculo.tssEmpleado.afp,
        ars: calculo.tssEmpleado.sfs,
        salarioNeto: netSalary,
        estado: "PENDIENTE" as const,
        fechaCreacion: now,
        fechaActualizacion: now,
      };

      await createPayroll.mutateAsync(payrollData);
      toast.success("Nómina creada exitosamente");
      reset();
    } catch (error) {
      toast.error("Error al crear la nómina");
      console.error("Error al crear nómina:", error);
    }
  };

  const addBonificacion = () => {
    const bonificaciones = watch("bonificaciones") || [];
    setValue("bonificaciones", [
      ...bonificaciones,
      { tipo: "horasExtra", monto: 0, descripcion: "" },
    ]);
  };

  const addDeduccion = () => {
    const deducciones = watch("deducciones") || [];
    setValue("deducciones", [
      ...deducciones,
      { tipo: "prestamo", monto: 0, descripcion: "" },
    ]);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Empleado
          </label>
          <select
            {...register("empleadoId", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Seleccione un empleado</option>
            {/* TODO: Integrar con lista de empleados */}
          </select>
          {errors.empleadoId && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.empleadoId.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Inicio del Período
            </label>
            <input
              type="datetime-local"
              {...register("periodo.inicio")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.periodo?.inicio && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.periodo.inicio.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fin del Período
            </label>
            <input
              type="datetime-local"
              {...register("periodo.fin")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.periodo?.fin && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.periodo.fin.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Pago
            </label>
            <input
              type="datetime-local"
              {...register("periodo.fechaPago")}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {errors.periodo?.fechaPago && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {errors.periodo.fechaPago.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Salario Base
          </label>
          <input
            type="number"
            step="0.01"
            {...register("salarioBase", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {errors.salarioBase && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {errors.salarioBase.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Bonificaciones
            </h3>
            <button
              type="button"
              onClick={addBonificacion}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 dark:hover:bg-green-600"
            >
              Agregar Bonificación
            </button>
          </div>
          {watch("bonificaciones")?.map((_, index) => (
            <div key={index} className="mt-2 grid grid-cols-3 gap-4">
              <select
                {...register(`bonificaciones.${index}.tipo`)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="horasExtra">Horas Extra</option>
                <option value="comision">Comisión</option>
                <option value="otro">Otro</option>
              </select>
              <input
                type="number"
                step="0.01"
                {...register(`bonificaciones.${index}.monto`, {
                  valueAsNumber: true,
                })}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <input
                type="text"
                {...register(`bonificaciones.${index}.descripcion`)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Deducciones
            </h3>
            <button
              type="button"
              onClick={addDeduccion}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 dark:hover:bg-red-600"
            >
              Agregar Deducción
            </button>
          </div>
          {watch("deducciones")?.map((_, index) => (
            <div key={index} className="mt-2 grid grid-cols-3 gap-4">
              <select
                {...register(`deducciones.${index}.tipo`)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="prestamo">Préstamo</option>
                <option value="adelanto">Adelanto</option>
                <option value="otro">Otro</option>
              </select>
              <input
                type="number"
                step="0.01"
                {...register(`deducciones.${index}.monto`, {
                  valueAsNumber: true,
                })}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <input
                type="text"
                {...register(`deducciones.${index}.descripcion`)}
                className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Descripción de la deducción"
              />
            </div>
          ))}
          <div className="mt-2 text-right">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Deducciones:{" "}
            </span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(
                watch("deducciones")?.reduce(
                  (sum, d) => sum + (d.monto || 0),
                  0
                ) || 0
              )}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
          disabled={createPayroll.isPending}
        >
          {createPayroll.isPending ? "Guardando..." : "Guardar Nómina"}
        </button>
      </form>

      {salarioBase > 0 && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Desglose de Cálculos
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Sueldo Bruto:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {formatCurrency(calculo.bruto)}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                TSS Empleado:
              </h4>
              <div className="ml-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AFP:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleado.afp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SFS:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleado.sfs)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700 dark:text-gray-300">
                    Total TSS:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.totalTSSEmpleado)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                ISR:
              </h4>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Impuesto:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(calculo.isr)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                Aportes del Empleador:
              </h4>
              <div className="ml-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">AFP:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleador.afp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SFS:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleador.sfs)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    INFOTEP:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleador.infotep)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Riesgo Laboral:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.tssEmpleador.riesgoLaboral)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700 dark:text-gray-300">
                    Total Aportes:
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {formatCurrency(calculo.totalTSSEmpleador)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
              <div className="flex justify-between font-medium text-lg">
                <span className="text-gray-900 dark:text-gray-100">
                  Salario Neto:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(calculo.neto)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
