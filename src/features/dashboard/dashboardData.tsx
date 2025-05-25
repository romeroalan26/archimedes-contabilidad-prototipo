import { DashboardData } from "./types";

export const mockDashboardData: DashboardData = {
  kpis: [
    {
      title: "Ingresos del Mes",
      value: "RD$ 245,678",
      change: "+12.5%",
      trend: "up" as const,
      description: "Comparado con el mes anterior",
      progress: 75,
    },
    {
      title: "Gastos del Mes",
      value: "RD$ 156,234",
      change: "-3.2%",
      trend: "down" as const,
      description: "Reducción respecto al mes pasado",
      progress: 60,
    },
    {
      title: "Flujo de Efectivo",
      value: "RD$ 89,444",
      change: "+8.7%",
      trend: "up" as const,
      description: "Balance positivo este mes",
      progress: 82,
    },
    {
      title: "Items por Conciliar",
      value: "7",
      change: "-2 items",
      trend: "down" as const,
      description: "Diferencia: RD$ 850.00",
      progress: 78,
    },
  ],
  alerts: [
    {
      id: 1,
      type: "success",
      message: "Factura #1234 pagada exitosamente",
      timestamp: new Date("2024-02-20T10:30:00"),
    },
    {
      id: 2,
      type: "warning",
      message: "Factura #5678 próxima a vencer",
      timestamp: new Date("2024-02-20T09:15:00"),
    },
    {
      id: 3,
      type: "error",
      message: "Error al procesar pago de Factura #9012",
      timestamp: new Date("2024-02-20T08:45:00"),
    },
  ],
  revenueChart: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ingresos",
        data: [1200000, 1500000, 1300000, 1800000, 1600000, 2000000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  },
  expensesChart: {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Gastos",
        data: [800000, 1000000, 900000, 1200000, 1100000, 1400000],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
    ],
  },
};
