import { useState } from "react";

interface NcfFormProps {
  onSubmit: (ncf: {
    type: "NCF" | "e-CF";
    number: string;
    status: "active" | "annulled";
  }) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export default function NcfForm({ onSubmit, isLoading, error }: NcfFormProps) {
  const [type, setType] = useState<"NCF" | "e-CF">("NCF");
  const [number, setNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      number,
      status: "active",
    });
  };

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error al procesar el NCF: {error.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Registrar NCF</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "NCF" | "e-CF")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="NCF">NCF</option>
              <option value="e-CF">e-CF</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ej: B0123456789"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={isLoading || !number}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Registrar NCF"}
          </button>
        </div>
      </div>
    </form>
  );
}
