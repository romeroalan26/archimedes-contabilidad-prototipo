import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../stores/authStore";
import { useSidebarStore } from "../stores/sidebarStore";
import { useState, useEffect } from "react";

interface SidebarProps {
  onLogout: () => void;
}

// Organizamos los items de navegación en grupos lógicos
const navigationGroups = [
  {
    title: "Principal",
    items: [
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
        badge: null,
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
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
        badge: null,
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
        badge: null,
      },
      {
        label: "Clientes",
        path: "/clientes",
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        badge: null,
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
        badge: null,
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
        badge: null,
      },
    ],
  },
  {
    title: "Finanzas",
    items: [
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
        badge: null,
      },
      {
        label: "Conciliación Bancaria",
        path: "/conciliacion-bancaria",
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
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        ),
        badge: null,
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
        badge: null,
      },
      {
        label: "Nómina",
        path: "/nomina",
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        ),
        badge: null,
      },
      {
        label: "Activos Fijos",
        path: "/activos-fijos",
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
        badge: null,
      },
    ],
  },
  {
    title: "Reportes y Cumplimiento",
    items: [
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
        badge: null,
      },
      {
        label: "NCF",
        path: "/ncf",
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        badge: null,
      },
      {
        label: "Formatos DGII",
        path: "/formatos-dgii",
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        ),
        badge: null,
      },
    ],
  },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    toggleMobile,
    setMobileOpen,
  } = useSidebarStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar la hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const hamburgerButton = document.getElementById("hamburger-button");

      if (isMobileOpen && sidebar && hamburgerButton) {
        const isClickInsideSidebar = sidebar.contains(event.target as Node);
        const isClickOnHamburger = hamburgerButton.contains(
          event.target as Node
        );

        if (!isClickInsideSidebar && !isClickOnHamburger) {
          setMobileOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, setMobileOpen]);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Botón hamburguesa para móvil */}
      <button
        id="hamburger-button"
        onClick={toggleMobile}
        aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isMobileOpen}
        className={`
          md:hidden fixed top-4 left-4 z-[100]
          p-3 rounded-xl
          bg-white text-gray-700 shadow-lg border border-gray-200
          hover:bg-gray-50 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? `${isCollapsed ? "translate-x-20" : "translate-x-80"} opacity-0 scale-95`
              : "translate-x-0 opacity-100 scale-100"
          }
        `}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isMobileOpen ? "rotate-90" : "rotate-0"
          }`}
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
              isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`
          fixed md:static inset-y-0 left-0 z-50
          ${isCollapsed ? "w-20" : "w-80"} 
          bg-white border-r border-gray-200 shadow-xl
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header con logo y branding */}
          <div
            className={`${
              isCollapsed ? "p-4" : "p-6"
            } border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600`}
          >
            <div className="flex items-center justify-between">
              <div className={`${isCollapsed ? "hidden" : "block"}`}>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Archímedes</h1>
                    <p className="text-sm text-indigo-100">Sistema Contable</p>
                  </div>
                </div>
              </div>

              {/* Logo colapsado */}
              <div className={`${isCollapsed ? "block" : "hidden"} mx-auto`}>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
              </div>

              {/* Botón de colapsar/expandir (solo visible en desktop) */}
              <button
                onClick={toggleCollapse}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
                title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
              >
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-200 group-hover:scale-110 ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Información del usuario */}
          <div
            className={`${isCollapsed ? "p-4" : "p-6"} border-b border-gray-100`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "Usuario"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "Administrador"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {currentTime.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigationGroups.map((group, groupIndex) => (
              <div
                key={group.title}
                className={`${groupIndex > 0 ? "mt-6" : ""}`}
              >
                {!isCollapsed && (
                  <div className="px-6 mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {group.title}
                    </h3>
                  </div>
                )}
                <div className={`px-3 space-y-1 ${isCollapsed ? "mb-6" : ""}`}>
                  {group.items.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                      <div key={item.path} className="relative group">
                        <Link
                          to={item.path}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              setMobileOpen(false);
                            }
                          }}
                          className={`
                            flex items-center ${
                              isCollapsed ? "justify-center px-3" : "px-4"
                            } py-3 rounded-xl text-sm font-medium
                            transition-all duration-200 relative overflow-hidden group
                            ${
                              isActive
                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                          title={isCollapsed ? item.label : undefined}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>
                          )}

                          <span
                            className={`${
                              isCollapsed ? "" : "mr-3"
                            } transition-all duration-200 ${
                              isActive ? "text-indigo-600" : ""
                            } group-hover:scale-110`}
                          >
                            {item.icon}
                          </span>

                          <span
                            className={`${isCollapsed ? "hidden" : "flex-1"} truncate`}
                          >
                            {item.label}
                          </span>
                        </Link>

                        {/* Tooltip para modo colapsado */}
                        {isCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                            {item.label}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer con acciones */}
          <div
            className={`${isCollapsed ? "p-3" : "p-6"} border-t border-gray-100 bg-gray-50`}
          >
            {!isCollapsed && (
              <div className="space-y-3">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-500 transition-colors duration-200"
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
                  Cerrar sesión
                </button>
              </div>
            )}

            {/* Botón de logout colapsado */}
            {isCollapsed && (
              <div className="relative group">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center p-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                  title="Cerrar sesión"
                >
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>

                {/* Tooltip para logout */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                  Cerrar sesión
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
