import { KpiData } from "../types";

interface KpiCardProps {
  data: KpiData;
}

export default function KpiCard({ data }: KpiCardProps) {
  const formatValue = (value: string) => {
    // Si el valor ya incluye RD$, no hacer nada
    if (value.includes("RD$")) {
      return value;
    }
    // Si es un número, formatearlo
    const numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    if (!isNaN(numericValue)) {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        minimumFractionDigits: 0,
      }).format(numericValue);
    }
    return value;
  };

  const calculatePreviousValue = () => {
    const currentValue = parseFloat(data.value.replace(/[^\d.-]/g, ""));
    const changePercent = parseFloat(data.change.replace(/[^\d.-]/g, ""));

    if (isNaN(currentValue) || isNaN(changePercent)) return null;

    const previousValue =
      data.trend === "up"
        ? currentValue / (1 + changePercent / 100)
        : currentValue / (1 - changePercent / 100);

    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(previousValue);
  };

  const previousValue = calculatePreviousValue();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Información principal */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {data.title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {formatValue(data.value)}
          </p>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                data.trend === "up"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
              }`}
            >
              <svg
                className={`w-3 h-3 mr-1 ${
                  data.trend === "up" ? "rotate-0" : "rotate-180"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17l5-5 5 5"
                />
              </svg>
              {data.change}
            </span>
          </div>
        </div>

        {/* Información contextual */}
        <div className="text-right ml-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Mes anterior
          </p>
          {previousValue && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {previousValue}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[120px]">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
