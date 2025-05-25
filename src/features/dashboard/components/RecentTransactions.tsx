import { Link } from "react-router-dom";

// Mock data - esto debe ser reemplazado con datos reales
const recentTransactions = [
  {
    id: "INV-001",
    type: "sale",
    client: "Constructora del Caribe SRL",
    amount: 125000,
    status: "completed",
    date: new Date("2024-02-20T10:30:00"),
  },
  {
    id: "PUR-045",
    type: "purchase",
    client: "Suministros Industriales RD",
    amount: 89500,
    status: "pending",
    date: new Date("2024-02-20T09:15:00"),
  },
  {
    id: "INV-002",
    type: "sale",
    client: "Obras y Servicios SRL",
    amount: 67300,
    status: "completed",
    date: new Date("2024-02-20T08:45:00"),
  },
  {
    id: "INV-003",
    type: "sale",
    client: "Grupo Metálico RD",
    amount: 234500,
    status: "overdue",
    date: new Date("2024-02-19T16:20:00"),
  },
  {
    id: "PUR-046",
    type: "purchase",
    client: "Materiales Premium SA",
    amount: 156800,
    status: "completed",
    date: new Date("2024-02-19T14:10:00"),
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Completado",
        color: "bg-green-100 text-green-800",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      };
    case "pending":
      return {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-800",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
    case "overdue":
      return {
        label: "Vencido",
        color: "bg-red-100 text-red-800",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
    default:
      return {
        label: "Desconocido",
        color: "bg-gray-100 text-gray-800",
        icon: null,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "sale":
      return {
        label: "Venta",
        color: "text-green-600",
        prefix: "+",
      };
    case "purchase":
      return {
        label: "Compra",
        color: "text-red-600",
        prefix: "-",
      };
    default:
      return {
        label: "Otro",
        color: "text-gray-600",
        prefix: "",
      };
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-900">
            Transacciones Recientes
          </h3>
          <Link
            to="/ventas"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Ver todas →
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID / Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTransactions.map((transaction) => {
              const statusConfig = getStatusConfig(transaction.status);
              const typeConfig = getTypeConfig(transaction.type);

              return (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.id}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {transaction.client}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${typeConfig.color}`}>
                      {typeConfig.prefix}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                    >
                      {statusConfig.icon && (
                        <span className="mr-1">{statusConfig.icon}</span>
                      )}
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{transaction.date.toLocaleDateString("es-ES")}</div>
                      <div className="text-xs text-gray-400">
                        {transaction.date.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer con resumen */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Mostrando {recentTransactions.length} transacciones recientes
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-gray-600">
                {
                  recentTransactions.filter((t) => t.status === "completed")
                    .length
                }{" "}
                completadas
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-gray-600">
                {
                  recentTransactions.filter((t) => t.status === "pending")
                    .length
                }{" "}
                pendientes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
