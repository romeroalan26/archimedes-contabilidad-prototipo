import { calcularAportesTSSEmpleado, calcularAportesTSSEmpleador, calcularISR } from "../utils/calculations";
import { useCalculoNominaRD } from "../hooks/usePayrollCalculations";

describe("Payroll Calculations", () => {
  describe("TSS Employee Contributions", () => {
    it("should calculate TSS for salary below caps", () => {
      const sueldo = 50000;
      const result = calcularAportesTSSEmpleado(sueldo);

      expect(result.afp).toBeCloseTo(sueldo * 0.0287, 2);
      expect(result.sfs).toBeCloseTo(sueldo * 0.0304, 2);
    });

    it("should apply caps for high salaries", () => {
      const sueldo = 400000;
      const result = calcularAportesTSSEmpleado(sueldo);

      expect(result.afp).toBeCloseTo(387050 * 0.0287, 2);
      expect(result.sfs).toBeCloseTo(193525 * 0.0304, 2);
    });
  });

  describe("TSS Employer Contributions", () => {
    it("should calculate employer contributions correctly", () => {
      const sueldo = 50000;
      const result = calcularAportesTSSEmpleador(sueldo);

      expect(result.afp).toBeCloseTo(sueldo * 0.0710, 2);
      expect(result.sfs).toBeCloseTo(sueldo * 0.0709, 2);
      expect(result.infotep).toBeCloseTo(sueldo * 0.01, 2);
      expect(result.riesgoLaboral).toBeCloseTo(sueldo * 0.012, 2);
    });

    it("should apply caps for employer contributions", () => {
      const sueldo = 400000;
      const result = calcularAportesTSSEmpleador(sueldo);

      expect(result.afp).toBeCloseTo(387050 * 0.0710, 2);
      expect(result.sfs).toBeCloseTo(193525 * 0.0709, 2);
      expect(result.infotep).toBeCloseTo(sueldo * 0.01, 2);
      expect(result.riesgoLaboral).toBeCloseTo(77410 * 0.012, 2);
    });
  });

  describe("ISR Calculation", () => {
    it("should calculate ISR for first bracket", () => {
      const sueldo = 400000;
      const isr = calcularISR(sueldo);
      expect(isr).toBe(0);
    });

    it("should calculate ISR for second bracket", () => {
      const sueldo = 500000;
      const isr = calcularISR(sueldo);
      expect(isr).toBeCloseTo((sueldo - 416220.01) * 0.15, 2);
    });

    it("should calculate ISR for third bracket", () => {
      const sueldo = 700000;
      const isr = calcularISR(sueldo);
      expect(isr).toBeCloseTo(31216 + (sueldo - 624329.01) * 0.20, 2);
    });

    it("should calculate ISR for fourth bracket", () => {
      const sueldo = 900000;
      const isr = calcularISR(sueldo);
      expect(isr).toBeCloseTo(79776 + (sueldo - 867123.01) * 0.25, 2);
    });
  });

  describe("Unified Calculation Hook", () => {
    it("should calculate all components correctly", () => {
      const sueldo = 50000;
      const result = useCalculoNominaRD(sueldo);

      expect(result.bruto).toBe(sueldo);
      expect(result.tssEmpleado.afp).toBeCloseTo(sueldo * 0.0287, 2);
      expect(result.tssEmpleado.sfs).toBeCloseTo(sueldo * 0.0304, 2);
      expect(result.tssEmpleador.afp).toBeCloseTo(sueldo * 0.0710, 2);
      expect(result.tssEmpleador.sfs).toBeCloseTo(sueldo * 0.0709, 2);
      expect(result.tssEmpleador.infotep).toBeCloseTo(sueldo * 0.01, 2);
      expect(result.tssEmpleador.riesgoLaboral).toBeCloseTo(sueldo * 0.012, 2);
      expect(result.isr).toBeCloseTo(calcularISR(sueldo - (sueldo * 0.0287 + sueldo * 0.0304)), 2);
      expect(result.neto).toBeCloseTo(
        sueldo - 
        (sueldo * 0.0287 + sueldo * 0.0304) - 
        calcularISR(sueldo - (sueldo * 0.0287 + sueldo * 0.0304)),
        2
      );
    });

    it("should handle salary caps correctly", () => {
      const sueldo = 400000;
      const result = useCalculoNominaRD(sueldo);

      expect(result.tssEmpleado.afp).toBeCloseTo(387050 * 0.0287, 2);
      expect(result.tssEmpleado.sfs).toBeCloseTo(193525 * 0.0304, 2);
      expect(result.tssEmpleador.afp).toBeCloseTo(387050 * 0.0710, 2);
      expect(result.tssEmpleador.sfs).toBeCloseTo(193525 * 0.0709, 2);
    });
  });
}); 