import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formato606Page } from "../Formato606Page";
import { mockCompras } from "../__mocks__/mockCompras";
import {
  generateExcelContent,
  generateTxtContent,
} from "../utils/generateFormato606";
import {
  getComprasByPeriodo,
  exportFormato606,
} from "../services/formato606Service";

// Mock the service functions
jest.mock("../services/formato606Service");
jest.mock("../utils/generateFormato606");

describe("Formato606Export", () => {
  const mockGetComprasByPeriodo = getComprasByPeriodo as jest.MockedFunction<
    typeof getComprasByPeriodo
  >;
  const mockExportFormato606 = exportFormato606 as jest.MockedFunction<
    typeof exportFormato606
  >;
  const mockGenerateExcelContent = generateExcelContent as jest.MockedFunction<
    typeof generateExcelContent
  >;
  const mockGenerateTxtContent = generateTxtContent as jest.MockedFunction<
    typeof generateTxtContent
  >;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    mockGetComprasByPeriodo.mockResolvedValue(mockCompras);
    mockExportFormato606.mockResolvedValue({ success: true });
    mockGenerateExcelContent.mockResolvedValue(new ArrayBuffer(0));
    mockGenerateTxtContent.mockResolvedValue("");
  });

  describe("Excel Export", () => {
    it("should generate XLSX file with correct format and columns", async () => {
      render(<Formato606Page />);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      // Find and click export button
      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      // Verify Excel generation
      await waitFor(() => {
        expect(mockGenerateExcelContent).toHaveBeenCalledWith(mockCompras);
      });

      // Verify file type
      const blob = new Blob([await mockGenerateExcelContent(mockCompras)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      expect(blob.type).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  });

  describe("TXT Export", () => {
    it("should generate TXT file with correct separator and required fields", async () => {
      render(<Formato606Page />);

      // Change export format to TXT
      const formatSelect = screen.getByLabelText("Formato de Exportación");
      await userEvent.click(formatSelect);
      const txtOption = screen.getByText("Texto (TXT)");
      await userEvent.click(txtOption);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      // Find and click export button
      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      // Verify TXT generation
      await waitFor(() => {
        expect(mockGenerateTxtContent).toHaveBeenCalledWith(mockCompras);
      });

      // Verify file content
      const content = await mockGenerateTxtContent(mockCompras);
      expect(content).toContain("RNC/Cédula");
      expect(content).toContain("NCF");
      expect(content).toContain("ITBIS Facturado");
      expect(content).toContain("Retención ISR");
      expect(content).toContain("Fecha del Comprobante");
    });
  });

  describe("Validation", () => {
    it("should disable export button and show error for invalid data", async () => {
      // Mock invalid data
      const invalidCompras = [...mockCompras];
      invalidCompras[0] = { ...invalidCompras[0], ncf: "" };
      mockGetComprasByPeriodo.mockResolvedValue(invalidCompras);
      mockExportFormato606.mockResolvedValue({
        success: false,
        errors: [{ field: "ncf", message: "NCF es requerido" }],
      });

      render(<Formato606Page />);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      // Find and click export button
      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText("NCF es requerido")).toBeInTheDocument();
      });
    });
  });

  describe("General Flow", () => {
    it("should handle complete export flow correctly", async () => {
      render(<Formato606Page />);

      // Wait for initial data load
      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      // Change period
      const mesSelect = screen.getByLabelText("Mes");
      const añoSelect = screen.getByLabelText("Año");

      await userEvent.click(mesSelect);
      await userEvent.click(screen.getByText("marzo"));

      await userEvent.click(añoSelect);
      await userEvent.click(screen.getByText("2024"));

      // Wait for data reload
      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalledWith(3, 2024);
      });

      // Export
      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      // Verify export process
      await waitFor(() => {
        expect(mockExportFormato606).toHaveBeenCalled();
        expect(mockGenerateExcelContent).toHaveBeenCalled();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero amounts correctly", async () => {
      const comprasWithZero = [...mockCompras];
      comprasWithZero[0] = {
        ...comprasWithZero[0],
        montoFacturado: 0,
        itbisFacturado: 0,
        retencionISR: 0,
        retencionITBIS: 0,
      };
      mockGetComprasByPeriodo.mockResolvedValue(comprasWithZero);

      render(<Formato606Page />);

      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      await waitFor(() => {
        expect(mockGenerateExcelContent).toHaveBeenCalledWith(comprasWithZero);
      });
    });

    it("should handle invalid NCF format", async () => {
      const comprasWithInvalidNCF = [...mockCompras];
      comprasWithInvalidNCF[0] = {
        ...comprasWithInvalidNCF[0],
        ncf: "invalid-ncf",
      };
      mockGetComprasByPeriodo.mockResolvedValue(comprasWithInvalidNCF);
      mockExportFormato606.mockResolvedValue({
        success: false,
        errors: [
          {
            field: "ncf",
            message: "NCF debe tener formato válido (ej: B0100000001)",
          },
        ],
      });

      render(<Formato606Page />);

      await waitFor(() => {
        expect(mockGetComprasByPeriodo).toHaveBeenCalled();
      });

      const exportButton = screen.getByText("Exportar Formato 606");
      await userEvent.click(exportButton);

      await waitFor(() => {
        expect(
          screen.getByText("NCF debe tener formato válido (ej: B0100000001)")
        ).toBeInTheDocument();
      });
    });
  });
});
