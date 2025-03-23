import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePayrollHistory, useEmployees } from "../hooks";
import { formatCurrency } from "../utils/format";
import { calculateTotalBonificaciones, calculateTotalDeducciones } from "../utils/calculations";
import type { PayrollDetails } from "../types/payroll";
import { generateTSSFile, generateExcelReport, generatePDFReport } from "../utils/export";
import { toast } from "react-hot-toast";
import { format, isWithinInterval, parseISO, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { mockEmployees, mockPayrolls } from "../__mocks__/mockTSSData";

export function PayrollHistoryPage() {
  const [filters, setFilters] = useState({
    empleadoId: "",
    periodoInicio: "",
    periodoFin: "",
  });

  const [dateError, setDateError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TODO: Replace with actual API calls
  const employees = mockEmployees;
  const payrolls = mockPayrolls;
  const loadingEmployees = false;
  const loadingPayrolls = false;
  const error = null;

  // Validate date range
  const validateDateRange = (inicio: string, fin: string) => {
    if (!inicio || !fin) {
      setDateError(null);
      return true;
    }

    const startDate = parseISO(inicio);
    const endDate = parseISO(fin);

    if (isAfter(startDate, endDate)) {
      setDateError("La fecha de inicio no puede ser mayor que la fecha de fin");
      return false;
    }

    setDateError(null);
    return true;
  };

  // Filter payrolls based on selected filters
  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => {
      // Filter by employee
      if (filters.empleadoId && payroll.empleadoId !== Number(filters.empleadoId)) {
        return false;
      }

      // Filter by date range
      if (filters.periodoInicio && filters.periodoFin) {
        if (!validateDateRange(filters.periodoInicio, filters.periodoFin)) {
          return false;
        }

        const payrollStartDate = parseISO(payroll.periodo.inicio);
        const startDate = parseISO(filters.periodoInicio);
        const endDate = parseISO(filters.periodoFin);

        if (!isWithinInterval(payrollStartDate, { start: startDate, end: endDate })) {
          return false;
        }
      }

      return true;
    });
  }, [payrolls, filters]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const paginatedPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleExportTSS = async () => {
    try {
      const period = new Date(filters.periodoInicio || new Date());
      const file = generateTSSFile(payrolls, employees, period);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `TSS_TEST.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Archivo TSS generado exitosamente");
    } catch (error) {
      console.error("Error al exportar TSS:", error);
      toast.error("Error al generar archivo TSS");
    }
  };

  const handleExportExcel = async () => {
    try {
      const file = await generateExcelReport(payrolls, employees);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nomina_${format(new Date(), "yyyy-MM")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Archivo Excel generado exitosamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      toast.error("Error al generar archivo Excel");
    }
  };

  const handleExportPDF = async (payrollId: number) => {
    try {
      const payroll = payrolls.find(p => p.id === payrollId);
      if (!payroll) throw new Error("Nómina no encontrada");
      
      const employee = employees?.find(e => e.id === payroll.empleadoId);
      if (!employee) throw new Error("Empleado no encontrado");
      
      const file = await generatePDFReport(payroll, employee);
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nomina_${payrollId}_${format(new Date(), "yyyy-MM-dd")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF generado exitosamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      toast.error("Error al generar PDF");
    }
  };

  if (error) {
    return <div className="text-red-500">Error al cargar el historial de nóminas</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Historial de Nóminas</h2>
        <div className="space-x-2">
          <button
            onClick={handleExportTSS}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loadingPayrolls || filteredPayrolls.length === 0}
          >
            Exportar TSS
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loadingPayrolls || filteredPayrolls.length === 0}
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Empleado
          </label>
          <select
            value={filters.empleadoId}
            onChange={(e) => setFilters({ ...filters, empleadoId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loadingEmployees}
          >
            <option value="">Todos</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filters.periodoInicio}
            onChange={(e) => {
              const newInicio = e.target.value;
              setFilters({ ...filters, periodoInicio: newInicio });
              validateDateRange(newInicio, filters.periodoFin);
            }}
            max={filters.periodoFin || undefined}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              dateError ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {dateError && (
            <p className="mt-1 text-sm text-red-600">{dateError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filters.periodoFin}
            onChange={(e) => {
              const newFin = e.target.value;
              setFilters({ ...filters, periodoFin: newFin });
              validateDateRange(filters.periodoInicio, newFin);
            }}
            min={filters.periodoInicio || undefined}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              dateError ? 'border-red-300' : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario Base
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario Neto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingPayrolls ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  Cargando...
                </td>
              </tr>
            ) : filteredPayrolls.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron resultados para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedPayrolls.map((payroll) => (
                <tr key={payroll.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payroll.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employees?.find((e) => e.id === payroll.empleadoId)?.nombre || payroll.empleadoId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(payroll.periodo.inicio), "dd/MM/yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("es-DO", {
                      style: "currency",
                      currency: "DOP",
                    }).format(payroll.salarioBase)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("es-DO", {
                      style: "currency",
                      currency: "DOP",
                    }).format(payroll.salarioNeto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payroll.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {payroll.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleExportPDF(payroll.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      PDF
                    </button>
                    <Link
                      to={`/nomina/${payroll.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Ver más
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
} 