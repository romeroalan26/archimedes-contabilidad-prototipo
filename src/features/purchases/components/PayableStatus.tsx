import { PayableStatus as PayableStatusType } from "../types";

interface PayableStatusProps {
  payableStatus: PayableStatusType | null;
  isLoading?: boolean;
  error?: Error | null;
}

export default function PayableStatus({
  payableStatus,
  isLoading,
  error,
}: PayableStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Estado de Cuenta del Proveedor
        </h3>
        <p>Cargando estado de cuenta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Estado de Cuenta del Proveedor
        </h3>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  if (!payableStatus) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Estado de Cuenta del Proveedor
        </h3>
        <p className="text-gray-500">
          Seleccione un proveedor para ver su estado de cuenta
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">
        Estado de Cuenta del Proveedor
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {payableStatus.transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b">
              <td className="py-1">{transaction.fecha}</td>
              <td>{transaction.descripcion}</td>
              <td
                className={
                  transaction.monto < 0 ? "text-green-600" : "text-red-600"
                }
              >
                {transaction.monto < 0
                  ? `- $${-transaction.monto}`
                  : `$${transaction.monto}`}
              </td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td colSpan={2} className="py-2 text-right">
              Total Pendiente:
            </td>
            <td className="text-red-600">${payableStatus.totalPendiente}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
