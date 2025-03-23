import config from './payroll-config.json';

export interface TSSConfig {
  porcentajes: {
    empleado: {
      sfs: number;
      afp: number;
    };
    empleador: {
      sfs: number;
      afp: number;
      infotep: number;
      riesgoLaboralBase: number;
      riesgoLaboralVariable: number;
    };
  };
  topes: {
    sfs: number;
    afp: number;
    riesgoLaboral: number;
  };
}

export interface ISRConfig {
  tramosAnuales: Array<{
    desde: number;
    hasta: number | null;
    tasa: number;
    exceso: number;
    cuotaFija?: number;
  }>;
}

export interface PayrollConfig {
  tss: TSSConfig;
  isr: ISRConfig;
}

export default config as PayrollConfig; 