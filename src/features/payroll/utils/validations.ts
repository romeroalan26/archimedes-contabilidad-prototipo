import { z } from "zod";

// TODO: Mover a configuración o base de datos
export const PAYROLL_LIMITS = {
  AFP_MAX_SALARY: 85000, // Tope salarial para AFP
  SFS_MAX_SALARY: 90000, // Tope salarial para SFS
  ISR_MAX_RATE: 0.25, // Tasa máxima de ISR
};

export const validatePayrollPeriod = (inicio: Date, fin: Date): boolean => {
  // Validar que las fechas estén en el mismo mes fiscal
  return (
    inicio.getFullYear() === fin.getFullYear() &&
    inicio.getMonth() === fin.getMonth()
  );
};

export const validateDeductions = (
  salarioBase: number,
  afp: number,
  ars: number,
  isr: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar topes de AFP
  const maxAFP = PAYROLL_LIMITS.AFP_MAX_SALARY * 0.0287;
  if (afp > maxAFP) {
    errors.push(`AFP no puede exceder ${maxAFP.toFixed(2)}`);
  }

  // Validar topes de SFS
  const maxSFS = PAYROLL_LIMITS.SFS_MAX_SALARY * 0.0304;
  if (ars > maxSFS) {
    errors.push(`SFS no puede exceder ${maxSFS.toFixed(2)}`);
  }

  // Validar tasa máxima de ISR
  const isrRate = isr / salarioBase;
  if (isrRate > PAYROLL_LIMITS.ISR_MAX_RATE) {
    errors.push(`ISR no puede exceder el ${PAYROLL_LIMITS.ISR_MAX_RATE * 100}% del salario bruto`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Schema de Zod extendido con validaciones de negocio
export const payrollSchema = z.object({
  empleadoId: z.number().min(1, "Debe seleccionar un empleado"),
  periodo: z
    .object({
      inicio: z.string().min(1, "La fecha de inicio es requerida"),
      fin: z.string().min(1, "La fecha de fin es requerida"),
      fechaPago: z.string().min(1, "La fecha de pago es requerida"),
    })
    .refine(
      (data) => {
        const inicio = new Date(data.inicio);
        const fin = new Date(data.fin);
        return validatePayrollPeriod(inicio, fin);
      },
      {
        message: "Las fechas deben estar en el mismo mes fiscal",
      }
    ),
  salarioBase: z
    .number()
    .min(0, "El salario base debe ser mayor o igual a 0")
    .max(1000000, "El salario base no puede exceder 1,000,000"),
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