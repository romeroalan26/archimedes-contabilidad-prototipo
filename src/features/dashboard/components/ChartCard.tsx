import { ChartData } from "../types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartCardProps {
  title: string;
  data: ChartData;
}

export default function ChartCard({ title, data }: ChartCardProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (context: any) {
            const value = new Intl.NumberFormat("es-DO", {
              style: "currency",
              currency: "DOP",
              minimumFractionDigits: 0,
            }).format(context.parsed.y);
            return `${context.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(229, 231, 235, 0.8)",
          borderDash: [2, 2],
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return new Intl.NumberFormat("es-DO", {
              style: "currency",
              currency: "DOP",
              minimumFractionDigits: 0,
              notation: "compact",
            }).format(value);
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: "white",
        borderWidth: 2,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      fill: true,
      backgroundColor: dataset.backgroundColor || "rgba(59, 130, 246, 0.1)",
      borderColor: dataset.borderColor || "rgb(59, 130, 246)",
      borderWidth: 3,
      pointBackgroundColor: "white",
      pointBorderColor: dataset.borderColor || "rgb(59, 130, 246)",
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: dataset.borderColor || "rgb(59, 130, 246)",
      pointHoverBorderColor: "white",
      pointHoverBorderWidth: 3,
    })),
  };

  const latestValue =
    data.datasets[0]?.data[data.datasets[0].data.length - 1] || 0;
  const previousValue =
    data.datasets[0]?.data[data.datasets[0].data.length - 2] || 0;
  const change = latestValue - previousValue;
  const changePercent =
    previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : "0";
  const isPositive = change >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">Últimos 6 meses</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(latestValue)}
            </p>
            <div className="flex items-center justify-end mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isPositive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <svg
                  className={`w-3 h-3 mr-1 ${isPositive ? "rotate-0" : "rotate-180"}`}
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
                {changePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-64">
          <Line options={options} data={enhancedData} />
        </div>
      </div>
    </div>
  );
}
