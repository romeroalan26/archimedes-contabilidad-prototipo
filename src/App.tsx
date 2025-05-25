import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardPage from "./features/dashboard/DashboardPage";
import { SalesPage } from "./features/sales/SalesPage";
import PurchasesPage from "./features/purchases/PurchasesPage";
import NewPurchasePage from "./features/purchases/pages/NewPurchasePage";
import ProjectsPage from "./features/projects/ProjectsPage";
import InventoryPage from "./features/inventory/InventoryPage";
import TreasuryPage from "./features/treasury/TreasuryPage";
import ReportsPage from "./features/reports/ReportsPage";
import { PayrollPage } from "./features/payroll/pages/PayrollPage";
import { PayrollHistoryPage } from "./features/payroll/pages/PayrollHistoryPage";
import { PayrollDetailPage } from "./features/payroll/pages/PayrollDetailPage";
import AssetsPage from "./features/assets/AssetsPage";
import LoginPage from "./features/auth/LoginPage";
import Layout from "./components/Layout";
import { useAuth } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { NCFPage } from "./features/ncf/NcfPage";
import { Formato606Page } from "./features/dgiiFormats/606/Formato606Page";
import { Formato607Page } from "./features/dgiiFormats/607/Formato607Page";
import { EmployeeDetailsPage } from "./features/payroll/pages/EmployeeDetailsPage";
import { ClientsPage } from "./features/clients/ClientsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BankReconciliationPage from "./features/bankReconciliation/BankReconciliationPage";
import AccountingPage from "./features/accounting/AccountingPage";
const queryClient = new QueryClient();

export default function App() {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useThemeStore();

  // Inicializar el tema al cargar la aplicación
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Ruta pública */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Rutas protegidas */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ventas" element={<SalesPage />} />
          <Route path="/compras" element={<PurchasesPage />} />
          <Route path="/compras/nueva" element={<NewPurchasePage />} />
          <Route path="/proyectos/*" element={<ProjectsPage />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/tesoreria" element={<TreasuryPage />} />
          <Route path="/contabilidad" element={<AccountingPage />} />
          <Route
            path="/conciliacion-bancaria"
            element={<BankReconciliationPage />}
          />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/nomina">
            <Route index element={<PayrollPage />} />
            <Route path="historial" element={<PayrollHistoryPage />} />
            <Route path=":id" element={<PayrollDetailPage />} />
          </Route>
          <Route path="/activos" element={<AssetsPage />} />
          <Route path="/ncf" element={<NCFPage />} />
          <Route path="/dgii/formato-606" element={<Formato606Page />} />
          <Route path="/dgii/formato-607" element={<Formato607Page />} />
          <Route
            path="/payroll/employees/:id"
            element={<EmployeeDetailsPage />}
          />
        </Route>

        {/* Redirigir cualquier otra ruta al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
