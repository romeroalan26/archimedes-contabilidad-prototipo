import { useState } from "react";
import { useAuth } from "../../state/useAuth";

const roles = ["administrador", "contador", "gerente"] as const;

type Role = (typeof roles)[number];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("administrador");
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Iniciar sesión
        </h2>
        <label className="block mb-2 text-sm font-medium">
          Selecciona tu rol
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          onClick={() => login(selectedRole)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar como {selectedRole}
        </button>
      </div>
    </div>
  );
}
