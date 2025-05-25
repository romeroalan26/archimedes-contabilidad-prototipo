import { Link } from "react-router-dom";

interface ReconciliationSummaryData {
  totalPendingItems: number;
  reconciledToday: number;
  currentDifference: number;
  lastReconciliationDate: string;
  accountsToReconcile: {
    name: string;
    pendingCount: number;
    difference: number;
  }[];
}

// Mock data - en producción vendría de una API
const mockReconciliationData: ReconciliationSummaryData = {
  totalPendingItems: 7,
  reconciledToday: 3,
  currentDifference: 850.0,
  lastReconciliationDate: "2024-01-15",
  accountsToReconcile: [
    {
      name: "Cuenta Principal",
      pendingCount: 4,
      difference: 850.0,
    },
    {
      name: "Cuenta Nómina",
      pendingCount: 2,
      difference: 0,
    },
    {
      name: "Cuenta Ahorros",
      pendingCount: 1,
      difference: 0,
    },
  ],
};

export default function BankReconciliationSummary() {
  const data = mockReconciliationData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-teal-600 dark:text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conciliación Bancaria
            </h3>
          </div>
          <Link
            to="/conciliacion-bancaria"
            className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors duration-200"
          >
            Ver todo →
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data.totalPendingItems}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pendientes
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {data.reconciledToday}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hoy
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div
              className={`text-lg sm:text-xl font-bold break-words ${data.currentDifference === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {formatCurrency(data.currentDifference)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Diferencia
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
              {formatDate(data.lastReconciliationDate)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Último proceso
            </div>
          </div>
        </div>

        {/* Accounts Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Estado por Cuenta
          </h4>
          {data.accountsToReconcile.map((account, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-3 sm:gap-0"
            >
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {account.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {account.pendingCount} transacciones pendientes
                  </p>
                </div>
              </div>
              <div className="flex justify-end sm:text-right">
                {account.difference === 0 ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      Balanceado
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-medium text-red-600 dark:text-red-400 break-words">
                      {formatCurrency(account.difference)}
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                      <span className="text-xs text-red-600 dark:text-red-400">
                        Diferencia
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/conciliacion-bancaria"
            className="flex items-center justify-center px-4 py-3 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="truncate">Iniciar Conciliación</span>
          </Link>
          <button className="flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate">Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
