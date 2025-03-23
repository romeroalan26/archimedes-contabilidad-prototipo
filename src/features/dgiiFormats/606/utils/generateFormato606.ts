import { Compra, Formato606Config } from "../types/formato606.types";
import * as XLSX from "xlsx";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const generateExcelContent = async (
  compras: Compra[]
): Promise<ArrayBuffer> => {
  const wb = XLSX.utils.book_new();

  // Prepare data for Excel
  const excelData = compras.map((compra) => ({
    "RNC/Cédula": compra.rncProveedor,
    "Tipo de Identificación": compra.tipoIdentificacion,
    NCF: compra.ncf,
    "Fecha del Comprobante": formatDate(compra.fechaComprobante),
    "Monto Facturado": compra.montoFacturado,
    "ITBIS Facturado": compra.itbisFacturado,
    "Retención ISR": compra.retencionISR,
    "Retención ITBIS": compra.retencionITBIS,
    "Tipo de Bien/Servicio": compra.tipoBienServicio,
    "Fecha de Pago": formatDate(compra.fechaPago),
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "Formato 606");

  // Generate Excel file as ArrayBuffer
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
};

export const generateTxtContent = async (
  compras: Compra[]
): Promise<string> => {
  // Prepare header
  const header = [
    "RNC/Cédula",
    "Tipo de Identificación",
    "NCF",
    "Fecha del Comprobante",
    "Monto Facturado",
    "ITBIS Facturado",
    "Retención ISR",
    "Retención ITBIS",
    "Tipo de Bien/Servicio",
    "Fecha de Pago",
  ].join("|");

  // Prepare data rows
  const rows = compras.map((compra) =>
    [
      compra.rncProveedor,
      compra.tipoIdentificacion,
      compra.ncf,
      formatDate(compra.fechaComprobante),
      compra.montoFacturado.toFixed(2),
      compra.itbisFacturado.toFixed(2),
      compra.retencionISR.toFixed(2),
      compra.retencionITBIS.toFixed(2),
      compra.tipoBienServicio,
      formatDate(compra.fechaPago),
    ].join("|")
  );

  // Combine header and rows
  return [header, ...rows].join("\n");
};

export const generateFormato606 = async (
  config: Formato606Config
): Promise<string> => {
  return `formato606_${config.mes}_${config.año}.${config.formatoExportacion}`;
};
