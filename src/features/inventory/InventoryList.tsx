const inventario = [
  { id: 1, nombre: "Bloques", unidad: "unidad", stock: 800 },
  { id: 2, nombre: "Cemento", unidad: "saco", stock: 200 },
  { id: 3, nombre: "Varilla", unidad: "barra", stock: 350 },
];

export default function InventoryList() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Inventario General</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Producto</th>
            <th>Unidad</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-1">{item.nombre}</td>
              <td>{item.unidad}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
