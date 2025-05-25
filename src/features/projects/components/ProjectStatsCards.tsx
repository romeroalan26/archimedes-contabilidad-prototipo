import { ProjectStats } from "../types";

interface ProjectStatsCardsProps {
  stats: ProjectStats;
}

export function ProjectStatsCards({ stats }: ProjectStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    // Formato más compacto para números grandes
    if (amount >= 1000000) {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amount);
    }
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const statsCards = [
    {
      title: "Total Proyectos",
      value: stats.total,
      subtitle: "Proyectos registrados",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "En Progreso",
      value: stats.enProgreso,
      subtitle: `${formatPercentage(stats.enProgreso, stats.total)} del total`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgGradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Completados",
      value: stats.completados,
      subtitle: `${formatPercentage(stats.completados, stats.total)} finalizados`,
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgGradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Inversión Total",
      value: formatCurrency(stats.presupuestoTotal),
      subtitle:
        stats.total > 0
          ? `${formatCurrency(stats.presupuestoPromedio)} promedio`
          : "Sin proyectos",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
      bgGradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Resumen Ejecutivo
        </h2>
        <p className="text-sm text-gray-600">Métricas clave de tus proyectos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}
            />

            {/* Content */}
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1 truncate">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {card.subtitle}
                  </p>
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 ml-4 p-3 rounded-lg ${card.iconBg}`}
                >
                  <div className={card.iconColor}>{card.icon}</div>
                </div>
              </div>

              {/* Progress indicator for active states */}
              {(card.title === "En Progreso" || card.title === "Completados") &&
                stats.total > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${card.bgGradient} transition-all duration-500`}
                        style={{
                          width: `${Math.min(
                            ((card.title === "En Progreso"
                              ? stats.enProgreso
                              : stats.completados) /
                              stats.total) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Quick Stats */}
      {stats.total > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                {stats.planificados}
              </p>
              <p className="text-xs text-gray-600">Planificados</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-600">
                {stats.suspendidos}
              </p>
              <p className="text-xs text-gray-600">Suspendidos</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-600">
                {stats.cancelados}
              </p>
              <p className="text-xs text-gray-600">Cancelados</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-emerald-600">
                {formatPercentage(stats.completados, stats.total)}
              </p>
              <p className="text-xs text-gray-600">Tasa Éxito</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
