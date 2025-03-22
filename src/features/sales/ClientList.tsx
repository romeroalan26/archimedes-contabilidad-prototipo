import { useState } from "react";

const clients = [
  { id: 1, nombre: "Constructora del Caribe", rnc: "101234567" },
  { id: 2, nombre: "Obras y Servicios SRL", rnc: "102345678" },
  { id: 3, nombre: "Grupo Metálico RD", rnc: "103456789" },
];

export default function ClientList() {
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.rnc.includes(search)
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Clientes</h3>
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
          {filtered.map((client) => (
            <tr key={client.id} className="border-b">
              <td className="py-1">{client.nombre}</td>
              <td>{client.rnc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
