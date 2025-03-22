import { Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./features/dashboard/DashboardPage";
import SalesPage from "./features/sales/SalesPage";
import PurchasesPage from "./features/purchases/PurchasesPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import InventoryPage from "./features/inventory/InventoryPage";
import LoginPage from "./features/auth/LoginPage";
import Layout from "./components/Layout";
import { useAuth } from "./state/useAuth";

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
        <Route path="/proyectos" element={<ProjectsPage />} />
        <Route path="/inventario" element={<InventoryPage />} />
      </Routes>
    </Layout>
  );
}
