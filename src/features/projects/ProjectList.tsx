const proyectos = [
  { id: 1, nombre: "Obra Hospital Regional", ubicacion: "Santiago" },
  { id: 2, nombre: "Construcción de Puente", ubicacion: "La Vega" },
  { id: 3, nombre: "Edificio Corporativo", ubicacion: "Santo Domingo" },
];

export default function ProjectList() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Listado de Proyectos</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Nombre</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-1">{p.nombre}</td>
              <td>{p.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
