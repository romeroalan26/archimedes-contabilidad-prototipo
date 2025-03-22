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
  Scale,
  CoreScaleOptions,
  Tick,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  data: ChartData;
}

export default function ChartCard({ title, data }: ChartCardProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number
          ) {
            return `$${Number(tickValue).toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
