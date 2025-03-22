import { DashboardData } from "./types";
import { RevenueIcon, ExpensesIcon, BalanceIcon } from "./components/KpiIcons";

export const mockDashboardData: DashboardData = {
  kpis: [
    {
      title: "Ingresos Totales",
      value: "RD$ 1,234,567",
      change: "+12.5%",
      trend: "up",
      icon: <RevenueIcon />,
    },
    {
      title: "Gastos Totales",
      value: "RD$ 987,654",
      change: "+8.2%",
      trend: "down",
      icon: <ExpensesIcon />,
    },
    {
      title: "Balance Neto",
      value: "RD$ 246,913",
      change: "+15.3%",
      trend: "up",
      icon: <BalanceIcon />,
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
