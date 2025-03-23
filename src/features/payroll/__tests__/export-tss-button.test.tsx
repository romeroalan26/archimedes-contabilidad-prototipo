import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayrollHistoryPage } from '../pages/PayrollHistoryPage';
import { mockEmployees, mockPayrolls } from '../__mocks__/mockTSSData';
import { generateTSSFile } from '../utils/export';

// Mock the export utility
jest.mock('../utils/export', () => ({
  generateTSSFile: jest.fn(),
  generateExcelReport: jest.fn(),
  generatePDFReport: jest.fn()
}));

describe('TSS Export Button', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the Blob and URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement and appendChild
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn()
    };
    document.createElement = jest.fn(() => mockAnchor as any);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  it('should generate and download TSS file when clicking the export button', async () => {
    // Mock the generateTSSFile function to return a Blob
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });
    (generateTSSFile as jest.Mock).mockReturnValue(mockBlob);

    render(<PayrollHistoryPage />);

    // Find and click the export button
    const exportButton = screen.getByText('Exportar TSS');
    fireEvent.click(exportButton);

    // Verify that generateTSSFile was called with correct parameters
    expect(generateTSSFile).toHaveBeenCalledWith(
      mockPayrolls,
      mockEmployees,
      expect.any(Date)
    );

    // Verify that URL.createObjectURL was called with the Blob
    expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

    // Verify that the anchor element was created and configured correctly
    expect(document.createElement).toHaveBeenCalledWith('a');
    const anchor = document.createElement('a');
    expect(anchor.href).toBe('mock-url');
    expect(anchor.download).toBe('TSS_TEST.txt');

    // Verify that the anchor was clicked
    expect(anchor.click).toHaveBeenCalled();

    // Verify cleanup
    expect(document.body.removeChild).toHaveBeenCalledWith(anchor);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('should show error toast when TSS generation fails', async () => {
    // Mock the generateTSSFile function to throw an error
    (generateTSSFile as jest.Mock).mockImplementation(() => {
      throw new Error('TSS generation failed');
    });

    render(<PayrollHistoryPage />);

    // Find and click the export button
    const exportButton = screen.getByText('Exportar TSS');
    fireEvent.click(exportButton);

    // Verify that the error toast is shown
    await waitFor(() => {
      expect(screen.getByText('Error al generar archivo TSS')).toBeInTheDocument();
    });
  });

  it('should be disabled when there are no payrolls', () => {
    // Mock empty payrolls array
    jest.spyOn(require('../__mocks__/mockTSSData'), 'mockPayrolls').mockReturnValue([]);

    render(<PayrollHistoryPage />);

    // Verify that the export button is disabled
    const exportButton = screen.getByText('Exportar TSS');
    expect(exportButton).toBeDisabled();
  });
}); 