import { RouteObject } from "react-router-dom";
import { PayrollPage } from "./pages/PayrollPage";
import { PayrollDetailPage } from "./pages/PayrollDetailPage";
import { PayrollHistoryPage } from "./pages/PayrollHistoryPage";

export const payrollRoutes: RouteObject[] = [
  {
    path: "payroll",
    children: [
      {
        index: true,
        element: <PayrollPage />,
      },
      {
        path: "history",
        element: <PayrollHistoryPage />,
      },
      {
        path: ":id",
        element: <PayrollDetailPage />,
      },
    ],
  },
]; 