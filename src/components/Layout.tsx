import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import { useSidebarStore } from "../stores/sidebarStore";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header";

export default function Layout() {
  const { logout } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirigir al login después del logout
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      {/* Botón flotante para colapsar/expandir sidebar */}
      <button
        onClick={toggleCollapse}
        className={`
          hidden md:flex fixed z-30 items-center justify-center
          w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg
          hover:shadow-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:border-indigo-200 dark:hover:border-indigo-600
          transition-all duration-300 ease-in-out group
          ${isCollapsed ? "left-[68px]" : "left-[308px]"}
          top-20
        `}
        title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-200 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
