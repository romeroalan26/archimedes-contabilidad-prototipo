import { useState } from "react";
import { useAuth } from "../../state/useAuth";

const roles = ["administrador", "contador", "gerente"] as const;

type Role = (typeof roles)[number];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("administrador");
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-6">
        {/* Logo y título */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-blue-600"
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
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Archimedes
          </h1>
          <p className="text-gray-500 text-sm">
            Sistema Contable Constructoras
          </p>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecciona tu rol
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-white text-gray-700 shadow-sm
                transition-all duration-200"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => login(selectedRole)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 
              text-white py-3 px-4 rounded-xl font-medium
              hover:from-blue-700 hover:to-blue-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transform transition-all duration-200 hover:scale-[1.02]
              shadow-lg hover:shadow-xl"
          >
            Entrar al sistema
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          <p>Archimedes Contabilidad v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
