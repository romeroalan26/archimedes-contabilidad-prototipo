import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../state/useAuth";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    label: "Ventas",
    path: "/ventas",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Compras",
    path: "/compras",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    label: "Proyectos",
    path: "/proyectos",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    label: "Inventario",
    path: "/inventario",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    ),
  },
  {
    label: "Tesorería",
    path: "/tesoreria",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    label: "Contabilidad",
    path: "/contabilidad",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isSidebarOpen}
        className={`
          md:hidden fixed top-6 left-6 z-[100]
          p-2.5 rounded-xl
          bg-white text-gray-700 shadow-lg
          hover:bg-gray-50 hover:text-gray-900
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transition-all duration-200 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-64 opacity-0"
              : "translate-x-0 opacity-100"
          }
        `}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-[90]
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 min-h-screen bg-gray-900 border-r border-gray-800
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex flex-col space-y-4 p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h1 className="text-xl font-bold text-white">Archimedes</h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-medium">
                  {user?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-200">
                {user ? user.charAt(0).toUpperCase() + user.slice(1) : ""}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white 
                flex items-center space-x-1 px-3 py-1.5 rounded-lg
                hover:bg-gray-800 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                hover:bg-gray-800 hover:translate-x-1
                ${
                  pathname === path
                    ? "bg-blue-500/20 text-blue-400 font-medium"
                    : "text-gray-400 hover:text-white"
                }
              `}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">
            Archimedes ERP v1.0.0
          </div>
        </div>
      </aside>

      {/* Overlay para cerrar el menú en móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[80] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-6 md:p-8 relative bg-gray-50">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
