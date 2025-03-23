import React from "react";
import { ReconciliationMovement } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MovementsListProps {
  movements: ReconciliationMovement[];
  onToggleReconciliation: (movementId: string) => void;
}

export const MovementsList: React.FC<MovementsListProps> = ({
  movements,
  onToggleReconciliation,
}) => {
  const getMovementTypeLabel = (type: ReconciliationMovement["type"]) => {
    switch (type) {
      case "DEPOSIT":
        return "Depósito";
      case "CHECK":
        return "Cheque";
      case "TRANSFER":
        return "Transferencia";
      default:
        return type;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(movement.date), "dd/MM/yyyy", { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getMovementTypeLabel(movement.type)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {movement.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat("es-DO", {
                  style: "currency",
                  currency: "DOP",
                }).format(movement.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    movement.isReconciled
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {movement.isReconciled ? "Conciliado" : "Pendiente"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onToggleReconciliation(movement.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {movement.isReconciled
                    ? "Desmarcar"
                    : "Marcar como conciliado"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
