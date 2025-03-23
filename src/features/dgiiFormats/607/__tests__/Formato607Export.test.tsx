import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formato607Page } from "../Formato607Page";
import { generateFormato607 } from "../utils/generateFormato607";
import { mockVentas } from "../__mocks__/mockVentas";
import { formato607Service } from "../services/formato607Service";
import { ExportOptions } from "../types/formato607.types";

// Mock del servicio
vi.mock("../services/formato607Service", () => ({
  formato607Service: {
    getVentasByPeriodo: vi.fn(),
    validateVentasForExport: vi.fn(),
    exportFormato607: vi.fn(),
  },
}));

// Mock de la función generateFormato607
vi.mock("../utils/generateFormato607", () => ({
  generateFormato607: vi.fn(),
}));

describe("Formato 607 Export Tests", () => {
  beforeEach(() => {
    // Reset mocks antes de cada prueba
    vi.clearAllMocks();

    // Mock por defecto para getVentasByPeriodo
    (formato607Service.getVentasByPeriodo as any).mockResolvedValue({
      data: mockVentas,
      success: true,
    });

    // Mock por defecto para validateVentasForExport
    (formato607Service.validateVentasForExport as any).mockResolvedValue({
      data: true,
      success: true,
    });

    // Mock por defecto para generateFormato607
    (generateFormato607 as any).mockResolvedValue(new Blob(["test data"]));
  });

  // Pruebas unitarias
  describe("generateFormato607", () => {
    it("genera archivo XLSX con formato correcto", async () => {
      const ventas = mockVentas;
      const options: ExportOptions = { formato: "xlsx", separador: "," };

      const blob = await generateFormato607(ventas, options);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });

    it("genera archivo TXT con formato correcto", async () => {
      const ventas = mockVentas;
      const options: ExportOptions = { formato: "txt", separador: "," };

      const blob = await generateFormato607(ventas, options);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("text/plain");
    });

    it("formatea montos con 2 decimales", async () => {
      const ventas = mockVentas;
      const options: ExportOptions = { formato: "txt", separador: "," };

      const blob = await generateFormato607(ventas, options);
      const content = await blob.text();

      // Verificar que los montos tienen 2 decimales
      expect(content).toMatch(/15000\.00/);
      expect(content).toMatch(/2280\.00/);
    });

    it("formatea fechas en DD/MM/AAAA", async () => {
      const ventas = mockVentas;
      const options: ExportOptions = { formato: "txt", separador: "," };

      const blob = await generateFormato607(ventas, options);
      const content = await blob.text();

      // Verificar formato de fecha
      expect(content).toMatch(/15\/03\/2024/);
      expect(content).toMatch(/20\/03\/2024/);
      expect(content).toMatch(/25\/03\/2024/);
    });
  });

  // Pruebas de validación
  describe("Validación de datos", () => {
    it("muestra error cuando hay NCF inválido", async () => {
      const ventasInvalidas = [
        {
          ...mockVentas[0],
          ncf: "", // NCF vacío
        },
      ];

      (formato607Service.validateVentasForExport as any).mockResolvedValue({
        data: false,
        success: false,
        message: "NCF inválido",
      });

      render(<Formato607Page />);

      // Esperar a que se carguen los datos
      await waitFor(() => {
        expect(screen.getByText("NCF inválido")).toBeInTheDocument();
      });
    });

    it("desactiva el botón de exportar cuando no hay datos válidos", async () => {
      (formato607Service.getVentasByPeriodo as any).mockResolvedValue({
        data: [],
        success: true,
      });

      render(<Formato607Page />);

      const exportButton = screen.getByText("Exportar");
      expect(exportButton).toBeDisabled();
    });
  });

  // Pruebas de integración
  describe("Flujo de exportación", () => {
    it("exporta archivo XLSX correctamente", async () => {
      render(<Formato607Page />);

      // Esperar a que se carguen los datos
      await waitFor(() => {
        expect(screen.getByText("Exportar")).toBeEnabled();
      });

      // Hacer clic en el botón de exportar
      const exportButton = screen.getByText("Exportar");
      fireEvent.click(exportButton);

      // Seleccionar opción de Excel
      const excelOption = screen.getByText("Exportar como Excel");
      fireEvent.click(excelOption);

      // Verificar que se llamó a generateFormato607
      await waitFor(() => {
        expect(generateFormato607).toHaveBeenCalledWith(
          expect.any(Array),
          expect.objectContaining({ formato: "xlsx" })
        );
      });
    });

    it("muestra mensaje de éxito al exportar", async () => {
      render(<Formato607Page />);

      // Esperar a que se carguen los datos
      await waitFor(() => {
        expect(screen.getByText("Exportar")).toBeEnabled();
      });

      // Hacer clic en el botón de exportar
      const exportButton = screen.getByText("Exportar");
      fireEvent.click(exportButton);

      // Seleccionar opción de Excel
      const excelOption = screen.getByText("Exportar como Excel");
      fireEvent.click(excelOption);

      // Verificar mensaje de éxito
      await waitFor(() => {
        expect(
          screen.getByText("Formato 607 exportado exitosamente")
        ).toBeInTheDocument();
      });
    });
  });

  // Pruebas edge
  describe("Casos edge", () => {
    it("maneja exportación sin seleccionar período", async () => {
      render(<Formato607Page />);

      // Intentar exportar sin seleccionar período
      const exportButton = screen.getByText("Exportar");
      fireEvent.click(exportButton);

      // Verificar que se muestra mensaje de error
      await waitFor(() => {
        expect(
          screen.getByText("No hay ventas para exportar")
        ).toBeInTheDocument();
      });
    });

    it("maneja ventas fuera del rango de fechas", async () => {
      // Mock de ventas fuera del rango
      const ventasFueraRango = [
        {
          ...mockVentas[0],
          fechaComprobante: "2024-04-01", // Fecha fuera del rango
        },
      ];

      (formato607Service.getVentasByPeriodo as any).mockResolvedValue({
        data: ventasFueraRango,
        success: true,
      });

      render(<Formato607Page />);

      // Verificar que no se muestran las ventas
      await waitFor(() => {
        expect(
          screen.getByText("No hay ventas para mostrar")
        ).toBeInTheDocument();
      });
    });

    it("exporta en formato CSV correctamente", async () => {
      render(<Formato607Page />);

      // Esperar a que se carguen los datos
      await waitFor(() => {
        expect(screen.getByText("Exportar")).toBeEnabled();
      });

      // Hacer clic en el botón de exportar
      const exportButton = screen.getByText("Exportar");
      fireEvent.click(exportButton);

      // Seleccionar opción de CSV
      const csvOption = screen.getByText("Exportar como TXT (CSV)");
      fireEvent.click(csvOption);

      // Verificar que se llamó a generateFormato607 con el formato correcto
      await waitFor(() => {
        expect(generateFormato607).toHaveBeenCalledWith(
          expect.any(Array),
          expect.objectContaining({
            formato: "txt",
            separador: ",",
          })
        );
      });
    });
  });
});
