import { InventoryStats } from "../types";

interface InventoryStatsCardsProps {
  stats: InventoryStats;
}

export function InventoryStatsCards({ stats }: InventoryStatsCardsProps) {
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

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const statsCards = [
    {
      title: "Total Productos",
      value: stats.totalProductos,
      subtitle: `${stats.productosActivos} activos`,
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Valor Inventario",
      value: formatCurrency(stats.valorInventario),
      subtitle: `${formatCurrency(stats.valorCompra)} costo`,
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
      bgGradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Alertas Stock",
      value: stats.productosStockBajo + stats.productosStockCritico,
      subtitle: `${stats.productosStockCritico} críticos`,
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.634 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      bgGradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Margen Promedio",
      value: `${formatPercentage(stats.margenPromedio)}`,
      subtitle: `${stats.categorias} categorías`,
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
        <p className="text-sm text-gray-600">Métricas clave de tu inventario</p>
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

              {/* Progress indicator for stock alerts */}
              {card.title === "Alertas Stock" && stats.totalProductos > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${card.bgGradient} transition-all duration-500`}
                      style={{
                        width: `${Math.min(
                          ((stats.productosStockBajo +
                            stats.productosStockCritico) /
                            stats.totalProductos) *
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
      {stats.totalProductos > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                {stats.movimientosHoy}
              </p>
              <p className="text-xs text-gray-600">Movimientos Hoy</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-amber-600">
                {stats.productosStockBajo}
              </p>
              <p className="text-xs text-gray-600">Stock Bajo</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-600">
                {stats.productosStockCritico}
              </p>
              <p className="text-xs text-gray-600">Stock Crítico</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-emerald-600">
                {formatPercentage(
                  ((stats.valorInventario - stats.valorCompra) /
                    stats.valorCompra) *
                    100
                )}
              </p>
              <p className="text-xs text-gray-600">Margen Global</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
