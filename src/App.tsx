import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./features/dashboard/DashboardPage";
import SalesPage from "./features/sales/SalesPage";
import PurchasesPage from "./features/purchases/PurchasesPage";
import ProjectsPage from "./features/projects/components/ProjectsPage";
import InventoryPage from "./features/inventory/InventoryPage";
import TreasuryPage from "./features/treasury/TreasuryPage";
import ReportsPage from "./features/reports/ReportsPage";
import AccountingPage from "./features/accounting/AccountingPage";
import { PayrollPage } from "./features/payroll/PayrollPage";
import AssetsPage from "./features/assets/AssetsPage";
import LoginPage from "./features/auth/LoginPage";
import Layout from "./components/Layout";
import { useAuth } from "./state/useAuth";
import NcfPage from "./features/ncf/NcfPage";
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/compras" element={<PurchasesPage />} />
        <Route path="/proyectos/*" element={<ProjectsPage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/tesoreria" element={<TreasuryPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
        <Route path="/contabilidad" element={<AccountingPage />} />
        <Route path="/nomina" element={<PayrollPage />} />
        <Route path="/activos" element={<AssetsPage />} />
        <Route path="/ncf" element={<NcfPage />} />
      </Routes>
    </Layout>
  );
}
