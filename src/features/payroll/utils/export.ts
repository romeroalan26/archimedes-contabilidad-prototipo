import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import type { PayrollDetails } from '../types/payroll';
import type { Employee } from '../types/employee';
import { formatDate } from './format';
import { format, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { aplicarTopeCotizable } from './calculations';

// TODO: Mover a configuración del backend
const TSS_CONFIG = {
  RNC: "123456789",
  COMPANY_NAME: "ARCHIMEDES CONTABILIDAD",
  VERSION: "1.0",
  SEPARATOR: "\t", // o "," según configuración
  FILE_TYPE: "txt", // o "xls" según configuración
  TIPO_NOMINA: "01", // 01 = ordinaria, 02 = extraordinaria
  TIPO_REGISTRO: "1", // 1 = Nómina
  TIPO_ARCHIVO: "1",  // 1 = Nuevo
  TOPES: {
    AFP: 150000,
    SFS: 150000
  }
};

interface TSSValidationError {
  field: string;
  message: string;
}

interface TSSRow {
  RNC: string;
  CEDULA: string;
  NOMBRE: string;
  SUELDO_MENSUAL: string;
  DIAS_TRABAJADOS: string;
  SUELDO_COTIZABLE_AFP: string;
  SUELDO_COTIZABLE_SFS: string;
  BONIFICACIONES: string;
  TIPO_CONTRATO: string;
  FECHA_INGRESO: string;
  FECHA_SALIDA: string;
  TIPO_NOMINA: string;
}

export const validateTSSData = (payrolls: PayrollDetails[], employees: Employee[]): TSSValidationError[] => {
  const errors: TSSValidationError[] = [];

  if (!TSS_CONFIG.RNC) {
    errors.push({ field: "RNC", message: "RNC es requerido" });
  }

  if (!TSS_CONFIG.COMPANY_NAME) {
    errors.push({ field: "COMPANY_NAME", message: "Nombre de empresa es requerido" });
  }

  payrolls.forEach((payroll, index) => {
    const employee = employees.find(e => e.id === payroll.empleadoId);
    if (!employee) {
      errors.push({ field: `payrolls[${index}].empleadoId`, message: "Empleado no encontrado" });
    }
    if (!employee?.cedula) {
      errors.push({ field: `payrolls[${index}].empleadoId`, message: "Cédula del empleado es requerida" });
    }
    if (!employee?.fechaIngreso) {
      errors.push({ field: `payrolls[${index}].empleadoId`, message: "Fecha de ingreso es requerida" });
    }
  });

  return errors;
};

const formatTSSRow = (payroll: PayrollDetails, employee: Employee): TSSRow => {
  // Calcular días trabajados reales
  const inicio = new Date(payroll.periodo.inicio);
  const fin = new Date(payroll.periodo.fin);
  const diasTrabajados = differenceInCalendarDays(fin, inicio) + 1;

  // Aplicar topes a sueldos cotizables
  const sueldoCotizableAFP = aplicarTopeCotizable(payroll.salarioBase, TSS_CONFIG.TOPES.AFP);
  const sueldoCotizableSFS = aplicarTopeCotizable(payroll.salarioBase, TSS_CONFIG.TOPES.SFS);

  return {
    RNC: TSS_CONFIG.RNC.replace(/-/g, ""),
    CEDULA: employee.cedula.replace(/-/g, ""),
    NOMBRE: employee.nombre.toUpperCase(),
    SUELDO_MENSUAL: payroll.salarioBase.toFixed(2),
    DIAS_TRABAJADOS: diasTrabajados.toString(),
    SUELDO_COTIZABLE_AFP: sueldoCotizableAFP.toFixed(2),
    SUELDO_COTIZABLE_SFS: sueldoCotizableSFS.toFixed(2),
    BONIFICACIONES: calculateTotalBonificaciones(payroll).toFixed(2),
    TIPO_CONTRATO: employee.tipoContrato,
    FECHA_INGRESO: format(new Date(employee.fechaIngreso), "dd/MM/yyyy", { locale: es }),
    FECHA_SALIDA: "", // Vacío si está activo
    TIPO_NOMINA: TSS_CONFIG.TIPO_NOMINA
  };
};

export const generateTSSFile = (payrolls: PayrollDetails[], employees: Employee[], period: Date): Blob => {
  const errors = validateTSSData(payrolls, employees);
  if (errors.length > 0) {
    throw new Error(`Errores de validación TSS: ${errors.map(e => e.message).join(', ')}`);
  }

  const rows: TSSRow[] = payrolls.map(payroll => {
    const employee = employees.find(e => e.id === payroll.empleadoId);
    if (!employee) throw new Error(`Empleado no encontrado para nómina ${payroll.id}`);
    return formatTSSRow(payroll, employee);
  });

  if (TSS_CONFIG.FILE_TYPE === "xls") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "TSS");
    return new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], 
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } else {
    // Formato TXT con encabezado del período
    const header = `Período: ${format(period, "MM/yyyy", { locale: es })}`;
    const columnHeaders = Object.keys(rows[0]).join(TSS_CONFIG.SEPARATOR);
    const content = [
      header,
      columnHeaders,
      ...rows.map(row => Object.values(row).join(TSS_CONFIG.SEPARATOR))
    ].join("\n");
    
    return new Blob([content], { type: "text/plain" });
  }
};

export const exportToTSS = (payroll: PayrollDetails): Blob => {
  // TODO: Implementar formato específico de TSS
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    {
      'ID Nómina': payroll.id,
      'Fecha': formatDate(payroll.periodo.fechaPago),
      'Cédula': payroll.empleadoId,
      'Salario Base': payroll.salarioBase,
      'AFP': payroll.afp,
      'ARS': payroll.ars,
      'ISR': payroll.isr,
      'Salario Neto': payroll.salarioNeto,
    },
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Nómina');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const exportToPDF = (payroll: PayrollDetails): Blob => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Nómina de Pago', 105, 20, { align: 'center' });
  
  // Información General
  doc.setFontSize(12);
  doc.text(`ID: ${payroll.id}`, 20, 40);
  doc.text(`Fecha: ${formatDate(payroll.periodo.fechaPago)}`, 20, 50);
  doc.text(`Período: ${formatDate(payroll.periodo.inicio)} - ${formatDate(payroll.periodo.fin)}`, 20, 60);
  
  // Salarios y Deducciones
  doc.setFontSize(14);
  doc.text('Detalle de Salarios y Deducciones', 20, 80);
  
  doc.setFontSize(12);
  let y = 90;
  doc.text(`Salario Base: ${formatCurrency(payroll.salarioBase)}`, 20, y);
  y += 10;
  
  doc.text('Bonificaciones:', 20, y);
  y += 10;
  payroll.bonificaciones.forEach(bonificacion => {
    doc.text(`- ${bonificacion.tipo}: ${formatCurrency(bonificacion.monto)}`, 30, y);
    y += 10;
  });
  
  doc.text('Deducciones:', 20, y);
  y += 10;
  doc.text(`- AFP: ${formatCurrency(payroll.afp)}`, 30, y);
  y += 10;
  doc.text(`- ARS: ${formatCurrency(payroll.ars)}`, 30, y);
  y += 10;
  doc.text(`- ISR: ${formatCurrency(payroll.isr)}`, 30, y);
  y += 10;
  
  payroll.deducciones.forEach(deduccion => {
    doc.text(`- ${deduccion.tipo}: ${formatCurrency(deduccion.monto)}`, 30, y);
    y += 10;
  });
  
  // Total
  doc.setFontSize(14);
  doc.text(`Salario Neto: ${formatCurrency(payroll.salarioNeto)}`, 20, y + 10);
  
  // Convertir a Blob
  const pdfBytes = doc.output('arraybuffer');
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const generateTSSContent = (payrolls: PayrollDetails[], employees: Employee[], period: Date): string => {
  const month = period.getMonth() + 1;
  const year = period.getFullYear();
  
  // Encabezado del archivo
  const header = [
    TSS_CONFIG.TIPO_REGISTRO,
    TSS_CONFIG.TIPO_ARCHIVO,
    TSS_CONFIG.RNC.padStart(11, '0'),
    TSS_CONFIG.COMPANY_NAME.padEnd(100, ' '),
    month.toString().padStart(2, '0'),
    year.toString(),
    TSS_CONFIG.VERSION,
    new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  ].join('|');

  // Registros de empleados
  const rows = payrolls.map(payroll => {
    const employee = employees.find(e => e.id === payroll.empleadoId);
    if (!employee) throw new Error(`Empleado no encontrado para nómina ${payroll.id}`);

    const salarioBruto = payroll.salarioBase + calculateTotalBonificaciones(payroll);
    
    return [
      employee.cedula.padStart(11, '0'),
      salarioBruto.toFixed(2).padStart(12, '0'),
      payroll.afp.toFixed(2).padStart(12, '0'),
      payroll.ars.toFixed(2).padStart(12, '0'),
      payroll.isr.toFixed(2).padStart(12, '0'),
      payroll.salarioNeto.toFixed(2).padStart(12, '0'),
      '0'.padStart(12, '0'), // Otros ingresos
      '0'.padStart(12, '0'), // Otros descuentos
      '0'.padStart(12, '0'), // Horas extras
      '0'.padStart(12, '0'), // Incentivos
      '0'.padStart(12, '0'), // Vacaciones
      '0'.padStart(12, '0'), // Cesantía
      '0'.padStart(12, '0'), // Prestaciones
    ].join('|');
  });

  return [header, ...rows].join('\n');
};

export const generateExcelReport = async (payrolls: PayrollDetails[], employees: Employee[]): Promise<Blob> => {
  const wb = XLSX.utils.book_new();
  
  // Hoja de resumen
  const summaryData = payrolls.map(payroll => {
    const employee = employees.find(e => e.id === payroll.empleadoId);
    return {
      "ID": payroll.id,
      "Empleado": employee?.nombre || payroll.empleadoId,
      "Cédula": employee?.cedula || "",
      "Período": `${format(new Date(payroll.periodo.inicio), "dd/MM/yyyy", { locale: es })} - ${format(new Date(payroll.periodo.fin), "dd/MM/yyyy", { locale: es })}`,
      "Salario Base": payroll.salarioBase,
      "Bonificaciones": calculateTotalBonificaciones(payroll),
      "AFP": payroll.afp,
      "SFS": payroll.ars,
      "ISR": payroll.isr,
      "Deducciones": calculateTotalDeducciones(payroll),
      "Salario Neto": payroll.salarioNeto,
      "Estado": payroll.estado
    };
  });
  
  const ws = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, ws, "Resumen");
  
  // Totales
  const totals = {
    "Total Nóminas": payrolls.length,
    "Total Salarios": payrolls.reduce((sum, p) => sum + p.salarioBase, 0),
    "Total Bonificaciones": payrolls.reduce((sum, p) => sum + calculateTotalBonificaciones(p), 0),
    "Total AFP": payrolls.reduce((sum, p) => sum + p.afp, 0),
    "Total SFS": payrolls.reduce((sum, p) => sum + p.ars, 0),
    "Total ISR": payrolls.reduce((sum, p) => sum + p.isr, 0),
    "Total Neto": payrolls.reduce((sum, p) => sum + p.salarioNeto, 0)
  };
  
  const totalsWs = XLSX.utils.json_to_sheet([totals]);
  XLSX.utils.book_append_sheet(wb, totalsWs, "Totales");
  
  return new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

export const generatePDFReport = async (payroll: PayrollDetails, employee: Employee): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Encabezado
  doc.setFontSize(20);
  doc.text("Reporte de Nómina", 105, 20, { align: "center" });
  
  // Información de empleado
  doc.setFontSize(12);
  doc.text(`Empleado: ${employee.nombre}`, 20, 40);
  doc.text(`Cédula: ${employee.cedula}`, 20, 50);
  doc.text(`Período: ${format(new Date(payroll.periodo.inicio), "dd/MM/yyyy", { locale: es })} - ${format(new Date(payroll.periodo.fin), "dd/MM/yyyy", { locale: es })}`, 20, 60);
  
  // Tabla de datos
  const startY = 80;
  const lineHeight = 10;
  
  // Encabezados de tabla
  doc.setFillColor(240, 240, 240);
  doc.rect(20, startY, 170, lineHeight, "F");
  doc.text("Concepto", 25, startY + 7);
  doc.text("Monto", 150, startY + 7, { align: "right" });
  
  // Datos
  let currentY = startY + lineHeight;
  
  // Salario Base
  doc.text("Salario Base", 25, currentY + 7);
  doc.text(formatCurrency(payroll.salarioBase), 150, currentY + 7, { align: "right" });
  currentY += lineHeight;
  
  // Bonificaciones
  payroll.bonificaciones.forEach(bonificacion => {
    doc.text(bonificacion.descripcion, 25, currentY + 7);
    doc.text(formatCurrency(bonificacion.monto), 150, currentY + 7, { align: "right" });
    currentY += lineHeight;
  });
  
  // Deducciones
  doc.text("AFP", 25, currentY + 7);
  doc.text(formatCurrency(payroll.afp), 150, currentY + 7, { align: "right" });
  currentY += lineHeight;
  
  doc.text("SFS", 25, currentY + 7);
  doc.text(formatCurrency(payroll.ars), 150, currentY + 7, { align: "right" });
  currentY += lineHeight;
  
  doc.text("ISR", 25, currentY + 7);
  doc.text(formatCurrency(payroll.isr), 150, currentY + 7, { align: "right" });
  currentY += lineHeight;
  
  // Total
  doc.setFont("helvetica", "bold");
  doc.text("Salario Neto", 25, currentY + 7);
  doc.text(formatCurrency(payroll.salarioNeto), 150, currentY + 7, { align: "right" });
  
  // Pie de página
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, 105, 280, { align: "center" });
  
  return doc.output("blob");
};

function calculateTotalBonificaciones(payroll: PayrollDetails): number {
  return payroll.bonificaciones.reduce((sum, b) => sum + b.monto, 0);
}

function calculateTotalDeducciones(payroll: PayrollDetails): number {
  return payroll.deducciones.reduce((sum, d) => sum + d.monto, 0);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP"
  }).format(amount);
} 