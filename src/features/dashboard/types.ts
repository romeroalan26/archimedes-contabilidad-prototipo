export interface KpiData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

export interface AlertData {
  id: number;
  type: "success" | "warning" | "error";
  message: string;
  timestamp: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

export interface DashboardData {
  kpis: KpiData[];
  alerts: AlertData[];
  revenueChart: ChartData;
  expensesChart: ChartData;
}
