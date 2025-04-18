import { useParams } from "react-router-dom";

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Detalles del Empleado</h1>
      <p>ID del empleado: {id}</p>
      {/* TODO: Implementar detalles del empleado */}
    </div>
  );
}

// Exportación nombrada para mantener consistencia con el import
export { EmployeeDetailsPage };
