import { useState } from "react";
import { Supplier } from "../types";

interface SupplierListProps {
  suppliers: Supplier[];
  onSelectSupplier?: (supplier: Supplier) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export default function SupplierList({
  suppliers,
  onSelectSupplier,
  isLoading,
  error,
}: SupplierListProps) {
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Proveedores</h3>
        <p>Cargando proveedores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Proveedores</h3>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  const filtered = suppliers.filter(
    (s) =>
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.rnc.includes(search)
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Proveedores</h3>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o RNC"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Nombre</th>
            <th>RNC</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((supplier) => (
            <tr key={supplier.id} className="border-b hover:bg-gray-50">
              <td className="py-1">{supplier.nombre}</td>
              <td>{supplier.rnc}</td>
              <td>
                {onSelectSupplier && (
                  <button
                    onClick={() => onSelectSupplier(supplier)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Seleccionar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
