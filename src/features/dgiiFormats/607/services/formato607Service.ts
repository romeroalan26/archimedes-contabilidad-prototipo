import {
  Venta,
  Periodo,
  ExportOptions,
  ApiResponse,
} from "../types/formato607.types";
import { mockVentas } from "../__mocks__/mockVentas";

// TODO: Replace with actual API calls
export const formato607Service = {
  getVentasByPeriodo: async (
    periodo: Periodo
  ): Promise<ApiResponse<Venta[]>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const ventas = mockVentas.filter((venta) => {
      const fecha = new Date(venta.fechaComprobante);
      return (
        fecha.getMonth() + 1 === periodo.mes &&
        fecha.getFullYear() === periodo.año
      );
    });

    return {
      data: ventas,
      success: true,
    };
  },

  validateVentasForExport: async (
    ventas: Venta[]
  ): Promise<ApiResponse<boolean>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const isValid = ventas.every((venta) => {
      return (
        venta.rncCedula.length > 0 &&
        venta.ncf.length > 0 &&
        venta.tipoComprobante.length > 0 &&
        venta.fechaComprobante.length > 0 &&
        venta.montoFacturado >= 0 &&
        venta.itbisFacturado >= 0
      );
    });

    return {
      data: isValid,
      success: isValid,
      message: isValid
        ? "Ventas válidas para exportar"
        : "Hay ventas con datos incompletos",
    };
  },

  exportFormato607: async (
    ventas: Venta[],
    options: ExportOptions
  ): Promise<ApiResponse<Blob>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a mock export using the provided data
    const exportData = ventas
      .map(
        (venta) =>
          `${venta.rncCedula},${venta.ncf},${venta.tipoComprobante},${venta.fechaComprobante},${venta.montoFacturado},${venta.itbisFacturado}`
      )
      .join("\n");

    // Use options to determine the export format
    const mimeType =
      options.formato === "txt"
        ? "text/plain"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const blob = new Blob([exportData], { type: mimeType });

    return {
      data: blob,
      success: true,
      message: "Formato 607 exportado exitosamente",
    };
  },
};
