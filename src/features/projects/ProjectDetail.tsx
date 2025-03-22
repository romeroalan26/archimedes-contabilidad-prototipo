const detalles = [
  { recurso: "Bloques", cantidad: 1200, costo: 30000 },
  { recurso: "Cemento", cantidad: 400, costo: 25000 },
  { recurso: "Varilla", cantidad: 150, costo: 40000 },
];

export default function ProjectDetail() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Detalle de Proyecto: Obra Hospital Regional
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Recurso</th>
            <th>Cantidad</th>
            <th>Costo</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-1">{d.recurso}</td>
              <td>{d.cantidad}</td>
              <td>${d.costo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
