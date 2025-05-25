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

  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{data.title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(data.value)}
          </p>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                data.trend === "up"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
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
            <span className="text-xs text-gray-500 ml-2">vs mes anterior</span>
          </div>
        </div>
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
            data.trend === "up"
              ? "bg-green-50 text-green-600 group-hover:bg-green-100"
              : "bg-red-50 text-red-600 group-hover:bg-red-100"
          }`}
        >
          <div className="group-hover:scale-110 transition-transform duration-300">
            {data.icon}
          </div>
        </div>
      </div>

      {/* Indicador de progreso visual */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-1000 ease-out ${
              data.trend === "up" ? "bg-green-500" : "bg-red-500"
            }`}
            style={{
              width: `${Math.min(Math.abs(parseFloat(data.change.replace("%", ""))), 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
