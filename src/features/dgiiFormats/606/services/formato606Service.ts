import {
  Compra,
  Formato606Config,
  ValidationError,
  ExportResult,
} from "../types/formato606.types";
import { mockCompras } from "../__mocks__/mockCompras";

// TODO: Replace with actual API calls
export const getComprasByPeriodo = async (
  mes: number,
  año: number
): Promise<Compra[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCompras.filter((compra) => {
    const fecha = new Date(compra.fechaComprobante);
    return fecha.getMonth() + 1 === mes && fecha.getFullYear() === año;
  });
};

export const validateComprasForExport = (
  compras: Compra[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  compras.forEach((compra, index) => {
    if (!compra.rncProveedor || compra.rncProveedor.length !== 9) {
      errors.push({
        field: `compras[${index}].rncProveedor`,
        message: "RNC/Cédula debe tener 9 dígitos",
      });
    }

    if (!compra.ncf || !/^[A-Z]\d{10}$/.test(compra.ncf)) {
      errors.push({
        field: `compras[${index}].ncf`,
        message: "NCF debe tener formato válido (ej: B0100000001)",
      });
    }

    if (!compra.tipoBienServicio || !/^\d{2}$/.test(compra.tipoBienServicio)) {
      errors.push({
        field: `compras[${index}].tipoBienServicio`,
        message: "Tipo de bien/servicio debe ser un código de 2 dígitos",
      });
    }
  });

  return errors;
};

export const exportFormato606 = async (
  config: Formato606Config,
  compras: Compra[]
): Promise<ExportResult> => {
  // TODO: Implement actual file generation and export
  // This is a mock implementation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const errors = validateComprasForExport(compras);
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  // Simulate successful export
  return {
    success: true,
    filePath: `formato606_${config.mes}_${config.año}.${config.formatoExportacion}`,
  };
};
