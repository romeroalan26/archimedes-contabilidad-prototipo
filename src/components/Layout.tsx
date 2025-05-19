import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import Sidebar from "./Sidebar.tsx";

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirigir al login después del logout
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
