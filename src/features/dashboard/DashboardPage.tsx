import { useState, useEffect } from "react";
import { KpiData, AlertData } from "./types";
import { mockDashboardData } from "./dashboardData.tsx";
import KpiCard from "./components/KpiCard";
import AlertCard from "./components/AlertCard";
import ChartCard from "./components/ChartCard";
import BankReconciliationSummary from "./components/BankReconciliationSummary";
import { useAuth } from "../../stores/authStore";

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
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar el dashboard
          </h3>
          <p className="text-gray-600 mb-4">
            Ocurrió un problema al cargar los datos. Por favor, intente
            nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {user?.name || "Usuario"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Aquí tienes un resumen de tu negocio para el{" "}
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                Actualizar datos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.kpis.map((kpi: KpiData, index: number) => (
              <KpiCard key={index} data={kpi} />
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Charts and Bank Reconciliation */}
          <div className="lg:col-span-8 space-y-8">
            {/* Charts Row */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Análisis Financiero
              </h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard
                  title="Ingresos Mensuales"
                  data={data.revenueChart}
                />
                <ChartCard title="Gastos Mensuales" data={data.expensesChart} />
              </div>
            </div>

            {/* Bank Reconciliation */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Conciliación Bancaria
              </h2>
              <BankReconciliationSummary />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Alerts Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notificaciones
                {data.alerts.length > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {data.alerts.length}
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {data.alerts.length > 0 ? (
                  data.alerts.map((alert: AlertData) => (
                    <AlertCard key={alert.id} data={alert} />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ¡Todo está al día!
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No hay notificaciones pendientes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Estado del Sistema
              </h2>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Servidor</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-600">
                        Operativo
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base de Datos</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-green-600">
                        Conectada
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Backup</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-blue-600">
                        Programado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
