import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Ene", ingresos: 15000, egresos: 10000 },
  { name: "Feb", ingresos: 18000, egresos: 13000 },
  { name: "Mar", ingresos: 12000, egresos: 7000 },
  { name: "Abr", ingresos: 20000, egresos: 15000 },
];

const kpis = [
  { label: "Ingresos", value: "$65,000" },
  { label: "Egresos", value: "$45,000" },
  { label: "Balance", value: "$20,000" },
];

const alertas = [
  "Pago a proveedor - 25 marzo",
  "Cobro de cliente - 27 marzo",
  "Pago TSS - 30 marzo",
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white p-4 rounded shadow text-center"
          >
            <h3 className="text-sm text-gray-500">{kpi.label}</h3>
            <p className="text-xl font-bold text-blue-600">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de ingresos vs egresos */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Ingresos vs Egresos</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ingresos" fill="#3b82f6" />
              <Bar dataKey="egresos" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas de pagos/cobros */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Alertas</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {alertas.map((alerta, idx) => (
            <li key={idx}>{alerta}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
