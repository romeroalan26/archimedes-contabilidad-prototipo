import { mockResumen } from "../../__mocks__/mockResumen";
import { formatCurrency } from "../../utils/format";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function PayrollSummary() {
  const { distribucion } = mockResumen;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Resumen de Nómina
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Período:{" "}
          {format(new Date(mockResumen.periodo.inicio), "dd/MM/yyyy", {
            locale: es,
          })}{" "}
          -{" "}
          {format(new Date(mockResumen.periodo.fin), "dd/MM/yyyy", {
            locale: es,
          })}
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Empleados
          </h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {mockResumen.totalEmpleados}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300">
            Nómina Bruta
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(mockResumen.totalNomina)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="text-sm font-medium text-red-700 dark:text-red-300">
            Total Deducciones
          </h3>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100">
            {formatCurrency(mockResumen.totalDeducciones)}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Salario Neto
          </h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatCurrency(mockResumen.totalNeto)}
          </p>
        </div>
      </div>

      {/* Estado de la Nómina */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Estado
        </h3>
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockResumen.estado === "PROCESADO"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : mockResumen.estado === "PENDIENTE"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            }`}
          >
            {mockResumen.estado.charAt(0) +
              mockResumen.estado.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Gráfico de Distribución por Categoría */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Distribución de Nómina
        </h3>
        <div className="h-96 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          {distribucion.porCategoria.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribucion.porCategoria}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="categoria"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#6B7280" }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  width={120}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  axisLine={{ stroke: "#6B7280" }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, white)",
                    border: "1px solid var(--tooltip-border, #e5e7eb)",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    color: "var(--tooltip-text, #111827)",
                  }}
                />
                <Bar dataKey="monto" radius={[4, 4, 0, 0]}>
                  {distribucion.porCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No hay datos para mostrar en el gráfico
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
