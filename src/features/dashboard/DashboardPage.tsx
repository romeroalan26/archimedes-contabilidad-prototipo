import { KpiData, AlertData } from "./types";
import { mockDashboardData } from "./dashboardData.tsx";
import KpiCard from "./components/KpiCard";
import AlertCard from "./components/AlertCard";
import ChartCard from "./components/ChartCard";

// TODO: Reemplazar con React Query cuando esté disponible
const useDashboardData = () => {
  // Simulación de datos - Reemplazar con React Query
  return {
    data: mockDashboardData,
    isLoading: false,
    error: null,
  };
};

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">
          Error al cargar los datos del dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.kpis.map((kpi: KpiData, index: number) => (
          <KpiCard key={index} data={kpi} />
        ))}
      </div>

      {/* Gráficos y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Ingresos" data={data.revenueChart} />
          <ChartCard title="Gastos" data={data.expensesChart} />
        </div>

        {/* Alertas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas Recientes
          </h2>
          <div className="space-y-4">
            {data.alerts.map((alert: AlertData) => (
              <AlertCard key={alert.id} data={alert} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
