export interface PayrollPeriod {
  inicio: string;
  fin: string;
  fechaPago: string;
}

export interface Bonificacion {
  tipo: "horasExtra" | "comision" | "otro";
  monto: number;
  descripcion: string;
}

export interface Deduccion {
  tipo: "prestamo" | "adelanto" | "otro";
  monto: number;
  descripcion: string;
}

export interface PayrollDetails {
  id: number;
  empleadoId: number;
  periodo: {
    inicio: string;
    fin: string;
    fechaPago: string;
  };
  salarioBase: number;
  bonificaciones: Bonificacion[];
  deducciones: Deduccion[];
  afp: number;
  ars: number;
  isr: number;
  salarioNeto: number;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fechaCreacion: string;
  fechaActualizacion: string;
  tssEmpleado: {
    afp: number;
    sfs: number;
  };
  tssEmpleador: {
    afp: number;
    sfs: number;
    infotep: number;
    riesgoLaboral: number;
  };
}

export interface PayrollSummary {
  periodo: {
    inicio: string;
    fin: string;
    fechaPago: string;
  };
  totalEmpleados: number;
  totalNomina: number;
  totalDeducciones: number;
  totalNeto: number;
  estado: "PROCESADO" | "PENDIENTE" | "CANCELADO";
  distribucion: {
    porEmpleado: Array<{
      nombre: string;
      salarioBase: number;
      bonificaciones: number;
      deducciones: number;
      neto: number;
    }>;
    porCategoria: Array<{
      categoria: string;
      monto: number;
      color: string;
    }>;
  };
}
