import { z } from 'zod';

export const employeeSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  cedula: z.string().regex(/^\d{11}$/, 'La cédula debe tener 11 dígitos'),
  posicion: z.string().min(2, 'La posición debe tener al menos 2 caracteres'),
  salario: z.number().min(0, 'El salario debe ser mayor a 0'),
  fechaIngreso: z.string().datetime(),
  estado: z.enum(['activo', 'inactivo']),
});

export const payrollPeriodSchema = z.object({
  inicio: z.string().datetime(),
  fin: z.string().datetime(),
  fechaPago: z.string().datetime(),
});

export const bonificacionSchema = z.object({
  tipo: z.enum(['horasExtra', 'comision', 'otro']),
  monto: z.number().min(0, 'El monto debe ser mayor a 0'),
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
});

export const deduccionSchema = z.object({
  tipo: z.enum(['prestamo', 'adelanto', 'otro']),
  monto: z.number().min(0, 'El monto debe ser mayor a 0'),
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
});

export const payrollDetailsSchema = z.object({
  empleadoId: z.number(),
  periodo: payrollPeriodSchema,
  salarioBase: z.number().min(0, 'El salario base debe ser mayor a 0'),
  bonificaciones: z.array(bonificacionSchema),
  deducciones: z.array(deduccionSchema),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
export type PayrollPeriodSchema = z.infer<typeof payrollPeriodSchema>;
export type BonificacionSchema = z.infer<typeof bonificacionSchema>;
export type DeduccionSchema = z.infer<typeof deduccionSchema>;
export type PayrollDetailsSchema = z.infer<typeof payrollDetailsSchema>; 