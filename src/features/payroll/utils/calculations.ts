import type { PayrollDetails, Bonificacion, Deduccion } from "../types/payroll";
import payrollConfig from "../../../config/payroll-config";

/**
 * Aplica el tope máximo a un valor cotizable
 */
export function aplicarTopeCotizable(valor: number, tope: number): number {
  return Math.min(valor, tope);
}

/**
 * Calcula los aportes TSS del empleado
 */
export function calcularAportesTSSEmpleado(sueldo: number): {
  afp: number;
  sfs: number;
} {
  const sueldoCotizableAFP = aplicarTopeCotizable(
    sueldo,
    payrollConfig.tss.topes.afp
  );
  const sueldoCotizableSFS = aplicarTopeCotizable(
    sueldo,
    payrollConfig.tss.topes.sfs
  );

  return {
    afp: sueldoCotizableAFP * payrollConfig.tss.porcentajes.empleado.afp,
    sfs: sueldoCotizableSFS * payrollConfig.tss.porcentajes.empleado.sfs,
  };
}

/**
 * Calcula los aportes TSS del empleador
 */
export function calcularAportesTSSEmpleador(
  sueldo: number,
  factorRiesgo: number = 0.01
): {
  afp: number;
  sfs: number;
  infotep: number;
  riesgoLaboral: number;
} {
  const sueldoCotizableAFP = aplicarTopeCotizable(
    sueldo,
    payrollConfig.tss.topes.afp
  );
  const sueldoCotizableSFS = aplicarTopeCotizable(
    sueldo,
    payrollConfig.tss.topes.sfs
  );
  const sueldoCotizableRiesgo = aplicarTopeCotizable(
    sueldo,
    payrollConfig.tss.topes.riesgoLaboral
  );

  return {
    afp: sueldoCotizableAFP * payrollConfig.tss.porcentajes.empleador.afp,
    sfs: sueldoCotizableSFS * payrollConfig.tss.porcentajes.empleador.sfs,
    infotep: sueldo * payrollConfig.tss.porcentajes.empleador.infotep,
    riesgoLaboral:
      sueldoCotizableRiesgo *
      (payrollConfig.tss.porcentajes.empleador.riesgoLaboralBase +
        factorRiesgo),
  };
}

/**
 * Calcula el ISR según la tabla de 2024
 */
export function calcularISR(sueldoLuegoTSS: number): number {
  const tramo = payrollConfig.isr.tramosAnuales.find(
    (t) => sueldoLuegoTSS >= t.desde && (!t.hasta || sueldoLuegoTSS <= t.hasta)
  );

  if (!tramo) return 0;

  const baseImponible = sueldoLuegoTSS - tramo.exceso;
  const impuesto = baseImponible * tramo.tasa;

  return impuesto + (tramo.cuotaFija || 0);
}

/**
 * Calcula el salario neto considerando todas las deducciones
 */
export function calcularSalarioNeto(sueldo: number): {
  bruto: number;
  tssEmpleado: { afp: number; sfs: number };
  tssEmpleador: {
    afp: number;
    sfs: number;
    infotep: number;
    riesgoLaboral: number;
  };
  isr: number;
  neto: number;
} {
  const tssEmpleado = calcularAportesTSSEmpleado(sueldo);
  const tssEmpleador = calcularAportesTSSEmpleador(sueldo);
  const sueldoLuegoTSS = sueldo - tssEmpleado.afp - tssEmpleado.sfs;
  const isr = calcularISR(sueldoLuegoTSS);
  const neto = sueldoLuegoTSS - isr;

  return {
    bruto: sueldo,
    tssEmpleado,
    tssEmpleador,
    isr,
    neto,
  };
}

/**
 * Calcula el total de bonificaciones
 */
export function calculateTotalBonificaciones(payroll: PayrollDetails): number {
  return payroll.bonificaciones.reduce(
    (total, bonificacion) => total + bonificacion.monto,
    0
  );
}

/**
 * Calcula el total de deducciones
 */
export function calculateTotalDeducciones(payroll: PayrollDetails): number {
  return payroll.deducciones.reduce(
    (total, deduccion) => total + deduccion.monto,
    0
  );
}

/**
 * Calcula todas las deducciones de nómina
 */
export function calculatePayrollDeductions(salarioBase: number): {
  afp: number;
  ars: number;
  isr: number;
} {
  const tssEmpleado = calcularAportesTSSEmpleado(salarioBase);
  const sueldoLuegoTSS = salarioBase - tssEmpleado.afp - tssEmpleado.sfs;
  const isr = calcularISR(sueldoLuegoTSS);

  return {
    afp: tssEmpleado.afp,
    ars: tssEmpleado.sfs,
    isr,
  };
}

export const calculatePayrollNet = (
  salarioBase: number,
  bonificaciones: Bonificacion[],
  deducciones: Deduccion[]
) => {
  const totalBonificaciones = bonificaciones.reduce(
    (sum, b) => sum + b.monto,
    0
  );
  const totalDeducciones = deducciones.reduce((sum, d) => sum + d.monto, 0);
  const { afp, ars, isr } = calculatePayrollDeductions(salarioBase);

  // Calcular salario bruto con bonificaciones
  const salarioBruto = salarioBase + totalBonificaciones;

  // Calcular salario neto restando todas las deducciones
  return salarioBruto - totalDeducciones - afp - ars - isr;
};
