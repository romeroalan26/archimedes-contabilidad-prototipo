import { generateTSSContent, generateTSSFile, generateExcelReport, generatePDFReport } from '../export';
import type { PayrollDetails } from '../../types/payroll';
import type { Employee } from '../../types/employee';
import payrollConfig from '../../../../config/payroll-config';

describe('Export Utils', () => {
  const mockEmployee: Employee = {
    id: 1,
    nombre: 'Juan Pérez',
    cedula: '123-456-7890',
    salario: 50000,
    fechaIngreso: '2023-01-01',
    estado: 'activo',
    posicion: 'Desarrollador',
    tipoContrato: '01'
  };

  const mockPayroll: PayrollDetails = {
    id: 1,
    empleadoId: 1,
    periodo: {
      inicio: '2024-03-01',
      fin: '2024-03-31',
      fechaPago: '2024-04-05'
    },
    salarioBase: 50000,
    bonificaciones: [
      {
        tipo: 'horasExtra',
        descripcion: 'Horas Extra',
        monto: 5000
      }
    ],
    deducciones: [
      {
        tipo: 'prestamo',
        descripcion: 'Préstamo',
        monto: 2000
      }
    ],
    afp: 2500,
    ars: 1500,
    isr: 5000,
    salarioNeto: 46000,
    estado: 'aprobado',
    fechaCreacion: '2024-03-01T00:00:00Z',
    fechaActualizacion: '2024-03-01T00:00:00Z',
    tssEmpleado: {
      afp: 2500,
      sfs: 1500
    },
    tssEmpleador: {
      afp: 5000,
      sfs: 3000,
      infotep: 500,
      riesgoLaboral: 600
    }
  };

  describe('TSS Export', () => {
    it('should generate valid TSS file in TXT format', () => {
      const file = generateTSSFile([mockPayroll], [mockEmployee], new Date('2024-03-01'));
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('text/plain');
      
      // Verificar contenido del archivo
      const content = file.text();
      expect(content).toContain('RNC\tCEDULA\tNOMBRE\tSUELDO_MENSUAL');
      expect(content).toContain('123456789\t1234567890\tJUAN PÉREZ\t50000.00');
    });

    it('should generate valid TSS file in XLS format', () => {
      // Cambiar configuración a XLS
      process.env.TSS_FILE_TYPE = 'xls';
      
      const file = generateTSSFile([mockPayroll], [mockEmployee], new Date('2024-03-01'));
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });

    it('should validate required fields before generating TSS', () => {
      const invalidEmployee = { ...mockEmployee, cedula: '' };
      
      expect(() => {
        generateTSSFile([mockPayroll], [invalidEmployee], new Date('2024-03-01'));
      }).toThrow('Cédula del empleado es requerida');
    });

    it('should format employee data correctly', () => {
      const file = generateTSSFile([mockPayroll], [mockEmployee], new Date('2024-03-01'));
      const content = file.text();
      
      // Verificar formato de datos
      expect(content).toContain('1234567890'); // Cédula sin guiones
      expect(content).toContain('JUAN PÉREZ'); // Nombre en mayúsculas
      expect(content).toContain('50000.00'); // Sueldo con 2 decimales
      expect(content).toContain('01/01/2023'); // Fecha en formato DD/MM/YYYY
    });

    it('should handle multiple employees', () => {
      const employee2 = { ...mockEmployee, id: 2, nombre: 'María García' };
      const payroll2 = { ...mockPayroll, id: 2, empleadoId: 2 };
      
      const file = generateTSSFile([mockPayroll, payroll2], [mockEmployee, employee2], new Date('2024-03-01'));
      const content = file.text();
      
      expect(content).toContain('JUAN PÉREZ');
      expect(content).toContain('MARÍA GARCÍA');
    });

    it('should handle different contract types', () => {
      const temporalEmployee = { ...mockEmployee, tipoContrato: '02' as const };
      const obraEmployee = { ...mockEmployee, tipoContrato: '03' as const };
      
      const file = generateTSSFile([mockPayroll], [temporalEmployee, obraEmployee], new Date('2024-03-01'));
      const content = file.text();
      
      expect(content).toContain('02'); // Temporal
      expect(content).toContain('03'); // Por Obra
    });

    it('should calculate correct worked days', () => {
      const partialMonthPayroll = {
        ...mockPayroll,
        periodo: {
          inicio: '2024-03-15',
          fin: '2024-03-31',
          fechaPago: '2024-04-05'
        }
      };
      
      const file = generateTSSFile([partialMonthPayroll], [mockEmployee], new Date('2024-03-01'));
      const content = file.text();
      
      // 31 - 15 + 1 = 17 días
      expect(content).toContain('17');
    });

    it('should apply salary caps correctly', () => {
      const highSalaryEmployee = {
        ...mockEmployee,
        salario: payrollConfig.tss.topes.afp + 10000
      };
      
      const highSalaryPayroll = {
        ...mockPayroll,
        salarioBase: payrollConfig.tss.topes.afp + 10000
      };
      
      const file = generateTSSFile([highSalaryPayroll], [highSalaryEmployee], new Date('2024-03-01'));
      const content = file.text();
      
      expect(content).toContain(payrollConfig.tss.topes.afp.toFixed(2)); // AFP cap
      expect(content).toContain(payrollConfig.tss.topes.sfs.toFixed(2)); // SFS cap
    });
  });

  describe('generateTSSContent', () => {
    it('should generate valid TSS content with correct format', () => {
      const content = generateTSSContent([mockPayroll], [mockEmployee], new Date('2024-03-01'));
      
      expect(content).toContain('1|1|000123456789|ARCHIMEDES CONTABILIDAD');
      expect(content).toContain('12345678901');
      expect(content).toContain('55000.00'); // salarioBase + bonificaciones
      expect(content).toContain('2500.00'); // afp
      expect(content).toContain('1500.00'); // ars
      expect(content).toContain('5000.00'); // isr
      expect(content).toContain('46000.00'); // salarioNeto
    });

    it('should throw error if employee not found', () => {
      expect(() => {
        generateTSSContent([mockPayroll], [], new Date('2024-03-01'));
      }).toThrow('Empleado no encontrado');
    });
  });

  describe('generateTSSFile', () => {
    it('should generate valid TSS file', () => {
      const file = generateTSSFile([mockPayroll], [mockEmployee], new Date('2024-03-01'));
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('text/plain');
    });

    it('should throw error if validation fails', () => {
      const invalidPayroll = { ...mockPayroll, empleadoId: 999 };
      
      expect(() => {
        generateTSSFile([invalidPayroll], [mockEmployee], new Date('2024-03-01'));
      }).toThrow('Errores de validación TSS');
    });
  });

  describe('generateExcelReport', () => {
    it('should generate valid Excel file with summary and totals', async () => {
      const file = await generateExcelReport([mockPayroll], [mockEmployee]);
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });

    it('should handle missing employee data', async () => {
      const file = await generateExcelReport([mockPayroll], []);
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  });

  describe('generatePDFReport', () => {
    it('should generate valid PDF file with employee details', async () => {
      const file = await generatePDFReport(mockPayroll, mockEmployee);
      
      expect(file).toBeInstanceOf(Blob);
      expect(file.type).toBe('application/pdf');
    });
  });
}); 