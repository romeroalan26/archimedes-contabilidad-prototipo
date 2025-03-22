interface SummaryCard {
  title: string;
  value: string | number;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

const summaryData: SummaryCard[] = [
  {
    title: "Total Activos",
    value: "45",
    description: "Activos registrados",
    trend: "up",
    trendValue: "+5% vs mes anterior",
  },
  {
    title: "Valor Total",
    value: "$125,000",
    description: "Valor en libros",
    trend: "up",
    trendValue: "+12% vs mes anterior",
  },
  {
    title: "Depreciación",
    value: "$2,500",
    description: "Depreciación mensual",
    trend: "down",
    trendValue: "-3% vs mes anterior",
  },
  {
    title: "Mantenimiento",
    value: "5",
    description: "Activos en mantenimiento",
    trend: "neutral",
    trendValue: "Sin cambios",
  },
];

export function FixedAssetSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryData.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {card.value}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{card.description}</p>
            <p
              className={`mt-2 text-sm ${
                card.trend === "up"
                  ? "text-green-600"
                  : card.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {card.trendValue}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
