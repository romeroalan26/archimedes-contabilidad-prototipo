import { Venta, ExportOptions } from "../types/formato607.types";
import * as XLSX from "xlsx";

export const generateFormato607 = async (
  ventas: Venta[],
  options: ExportOptions
): Promise<Blob> => {
  // Validate data before generating
  if (!ventas.length) {
    throw new Error("No hay ventas para exportar");
  }

  if (options.formato === "xlsx") {
    return generateExcel(ventas);
  } else {
    return generateTxt(ventas, options.separador);
  }
};

const generateExcel = (ventas: Venta[]): Blob => {
  const headers = [
    "RNC/Cédula",
    "Tipo de ID",
    "NCF",
    "Tipo de Comprobante",
    "Fecha Comprobante",
    "Monto Facturado",
    "ITBIS Facturado",
    "Retención ISR",
    "Retención ITBIS",
    "Forma de Pago",
  ];

  const rows = ventas.map((venta) => [
    venta.rncCedula,
    venta.tipoIdentificacion,
    venta.ncf,
    venta.tipoComprobante,
    venta.fechaComprobante,
    venta.montoFacturado,
    venta.itbisFacturado,
    venta.retenciones.isr,
    venta.retenciones.itbis,
    venta.formaPago,
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Formato 607");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

const generateTxt = (ventas: Venta[], separador: string): Blob => {
  const headers = [
    "RNC/Cédula",
    "Tipo de ID",
    "NCF",
    "Tipo de Comprobante",
    "Fecha Comprobante",
    "Monto Facturado",
    "ITBIS Facturado",
    "Retención ISR",
    "Retención ITBIS",
    "Forma de Pago",
  ].join(separador);

  const rows = ventas.map((venta) =>
    [
      venta.rncCedula,
      venta.tipoIdentificacion,
      venta.ncf,
      venta.tipoComprobante,
      venta.fechaComprobante,
      venta.montoFacturado.toFixed(2),
      venta.itbisFacturado.toFixed(2),
      venta.retenciones.isr.toFixed(2),
      venta.retenciones.itbis.toFixed(2),
      venta.formaPago,
    ].join(separador)
  );

  const content = [headers, ...rows].join("\n");
  return new Blob([content], { type: "text/plain" });
};
