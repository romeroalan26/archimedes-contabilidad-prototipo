import { 
  calcularAportesTSSEmpleado, 
  calcularAportesTSSEmpleador, 
  calcularISR, 
  calcularSalarioNeto,
   
} from '../calculations';

describe('Payroll Calculations', () => {
  describe('TSS Calculations', () => {
    it('should calculate employee TSS contributions correctly', () => {
      const sueldo = 50000;
      const aportes = calcularAportesTSSEmpleado(sueldo);
      
      expect(aportes.afp).toBeCloseTo(sueldo * 0.0287, 2);
      expect(aportes.sfs).toBeCloseTo(sueldo * 0.0304, 2);
    });

    it('should apply salary caps correctly', () => {
      const sueldo = 100000;
      const aportes = calcularAportesTSSEmpleado(sueldo);
      
      expect(aportes.afp).toBeCloseTo(85000 * 0.0287, 2); // AFP cap
      expect(aportes.sfs).toBeCloseTo(90000 * 0.0304, 2); // SFS cap
    });

    it('should calculate employer TSS contributions correctly', () => {
      const sueldo = 50000;
      const aportes = calcularAportesTSSEmpleador(sueldo);
      
      expect(aportes.afp).toBeCloseTo(sueldo * 0.071, 2);
      expect(aportes.sfs).toBeCloseTo(sueldo * 0.0704, 2);
      expect(aportes.infotep).toBeCloseTo(sueldo * 0.01, 2);
      expect(aportes.riesgoLaboral).toBeCloseTo(sueldo * 0.02, 2); // 1% base + 1% factor
    });
  });

  describe('ISR Calculations', () => {
    it('should calculate ISR correctly for different salary ranges', () => {
      // Sin ISR
      expect(calcularISR(400000)).toBe(0);
      
      // 15% bracket
      expect(calcularISR(500000)).toBeCloseTo((500000 - 416220) * 0.15, 2);
      
      // 20% bracket
      expect(calcularISR(700000)).toBeCloseTo((700000 - 624329) * 0.20, 2);
      
      // 25% bracket
      expect(calcularISR(900000)).toBeCloseTo((900000 - 867123) * 0.25, 2);
      
      // 30% bracket
      expect(calcularISR(1100000)).toBeCloseTo((1100000 - 1000000) * 0.30, 2);
    });
  });

  describe('Net Salary Calculation', () => {
    it('should calculate net salary correctly', () => {
      const sueldo = 50000;
      const calculo = calcularSalarioNeto(sueldo);
      
      expect(calculo.bruto).toBe(sueldo);
      expect(calculo.tssEmpleado.afp).toBeCloseTo(sueldo * 0.0287, 2);
      expect(calculo.tssEmpleado.sfs).toBeCloseTo(sueldo * 0.0304, 2);
      expect(calculo.tssEmpleador.afp).toBeCloseTo(sueldo * 0.071, 2);
      expect(calculo.tssEmpleador.sfs).toBeCloseTo(sueldo * 0.0704, 2);
      expect(calculo.tssEmpleador.infotep).toBeCloseTo(sueldo * 0.01, 2);
      expect(calculo.tssEmpleador.riesgoLaboral).toBeCloseTo(sueldo * 0.02, 2);
      
      const sueldoLuegoTSS = sueldo - calculo.tssEmpleado.afp - calculo.tssEmpleado.sfs;
      expect(calculo.isr).toBeCloseTo(calcularISR(sueldoLuegoTSS), 2);
      expect(calculo.neto).toBeCloseTo(sueldoLuegoTSS - calculo.isr, 2);
    });

    it('should handle salary caps in net calculation', () => {
      const sueldo = 100000;
      const calculo = calcularSalarioNeto(sueldo);
      
      expect(calculo.tssEmpleado.afp).toBeCloseTo(85000 * 0.0287, 2);
      expect(calculo.tssEmpleado.sfs).toBeCloseTo(90000 * 0.0304, 2);
      expect(calculo.tssEmpleador.afp).toBeCloseTo(85000 * 0.071, 2);
      expect(calculo.tssEmpleador.sfs).toBeCloseTo(90000 * 0.0704, 2);
    });
  });
}); 
