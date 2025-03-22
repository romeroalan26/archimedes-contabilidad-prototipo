import { useState } from "react";
import { suppliers } from "../../data/suppliers";

export default function SupplierList() {
  const [search, setSearch] = useState("");

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
          </tr>
        </thead>
        <tbody>
          {filtered.map((supplier) => (
            <tr key={supplier.id} className="border-b">
              <td className="py-1">{supplier.nombre}</td>
              <td>{supplier.rnc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
