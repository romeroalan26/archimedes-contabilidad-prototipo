import { render, screen, fireEvent } from '@testing-library/react';
import { PayrollHistoryPage } from '../PayrollHistoryPage';
import { mockEmployees, mockPayrolls } from '../../__mocks__/mockTSSData';

// Mock the hooks
jest.mock('../../hooks', () => ({
  usePayrollHistory: () => ({
    data: mockPayrolls,
    isLoading: false,
    error: null
  }),
  useEmployees: () => ({
    data: mockEmployees,
    isLoading: false,
    error: null
  })
}));

describe('PayrollHistoryPage', () => {
  beforeEach(() => {
    render(<PayrollHistoryPage />);
  });

  it('should display all payrolls by default', () => {
    // Check if all mock payrolls are displayed
    mockPayrolls.forEach(payroll => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });
  });

  it('should filter payrolls by employee', () => {
    // Get the employee select element
    const employeeSelect = screen.getByLabelText('Empleado');
    
    // Select an employee
    fireEvent.change(employeeSelect, { target: { value: '1' } });
    
    // Check if only the selected employee's payrolls are displayed
    const employeePayrolls = mockPayrolls.filter(p => p.empleadoId === 1);
    employeePayrolls.forEach(payroll => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });
    
    // Check if other payrolls are not displayed
    const otherPayrolls = mockPayrolls.filter(p => p.empleadoId !== 1);
    otherPayrolls.forEach(payroll => {
      expect(screen.queryByText(payroll.id.toString())).not.toBeInTheDocument();
    });
  });

  it('should filter payrolls by date range', () => {
    // Get the date inputs
    const startDateInput = screen.getByLabelText('Fecha Inicio');
    const endDateInput = screen.getByLabelText('Fecha Fin');
    
    // Set date range
    fireEvent.change(startDateInput, { target: { value: '2024-03-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-03-15' } });
    
    // Check if only payrolls within the date range are displayed
    const filteredPayrolls = mockPayrolls.filter(p => {
      const payrollStart = new Date(p.periodo.inicio);
      const startDate = new Date('2024-03-01');
      const endDate = new Date('2024-03-15');
      return payrollStart >= startDate && payrollStart <= endDate;
    });
    
    filteredPayrolls.forEach(payroll => {
      expect(screen.getByText(payroll.id.toString())).toBeInTheDocument();
    });
  });

  it('should show no results message when filters return no matches', () => {
    // Set an invalid employee ID
    const employeeSelect = screen.getByLabelText('Empleado');
    fireEvent.change(employeeSelect, { target: { value: '999' } });
    
    // Check if the no results message is displayed
    expect(screen.getByText('No se encontraron resultados para los filtros seleccionados.')).toBeInTheDocument();
  });

  it('should reset to first page when filters change', () => {
    // Set initial page to 2
    const nextButton = screen.getByText('Siguiente');
    fireEvent.click(nextButton);
    
    // Apply a filter
    const employeeSelect = screen.getByLabelText('Empleado');
    fireEvent.change(employeeSelect, { target: { value: '1' } });
    
    // Check if we're back to page 1
    expect(screen.getByText('Página 1 de')).toBeInTheDocument();
  });
}); 