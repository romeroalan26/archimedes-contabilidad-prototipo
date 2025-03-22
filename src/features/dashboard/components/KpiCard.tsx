import { KpiData } from "../types";

interface KpiCardProps {
  data: KpiData;
}

export default function KpiCard({ data }: KpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{data.title}</p>
          <p className="text-2xl font-bold mt-1">
            ${data.value.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          {data.icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`text-sm ${
            data.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {data.trend === "up" ? "↑" : "↓"} {data.change}%
        </span>
        <span className="text-sm text-gray-600 ml-2">vs mes anterior</span>
      </div>
    </div>
  );
}
