import { calcularAportesTSSEmpleado, calcularAportesTSSEmpleador, calcularISR } from "../utils/calculations";

export const useCalculoNominaRD = (sueldo: number, factorRiesgo: number = 0.01) => {
  // TODO: Obtener factor de riesgo desde el backend
  const tssEmpleado = calcularAportesTSSEmpleado(sueldo);
  const tssEmpleador = calcularAportesTSSEmpleador(sueldo, factorRiesgo);
  
  const sueldoLuegoTSS = sueldo - tssEmpleado.afp - tssEmpleado.sfs;
  const isr = calcularISR(sueldoLuegoTSS);
  const neto = sueldoLuegoTSS - isr;

  return {
    bruto: sueldo,
    tssEmpleado,
    tssEmpleador,
    isr,
    neto,
    totalTSSEmpleado: tssEmpleado.afp + tssEmpleado.sfs,
    totalTSSEmpleador: tssEmpleador.afp + tssEmpleador.sfs + tssEmpleador.infotep + tssEmpleador.riesgoLaboral
  };
}; 