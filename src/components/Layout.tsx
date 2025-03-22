import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../state/useAuth";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Ventas", path: "/ventas" },
  { label: "Compras", path: "/compras" },
  { label: "Proyectos", path: "/proyectos" },
  { label: "Inventario", path: "/inventario" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Archimedes</h1>
          <button
            onClick={logout}
            className="text-sm bg-red-600 px-2 py-1 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
        <div className="text-sm text-gray-400 mb-4">Usuario: {user}</div>
        <nav className="flex flex-col gap-3">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`${
                pathname === path ? "bg-gray-700" : ""
              } p-2 rounded hover:bg-gray-700`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
