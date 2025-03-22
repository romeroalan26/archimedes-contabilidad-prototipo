import { AccountStatement as AccountStatementType } from "../types";

interface AccountStatementProps {
  statements: AccountStatementType[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function AccountStatement({
  statements,
  isLoading,
  error,
}: AccountStatementProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error al cargar el estado de cuenta: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Estado de Cuenta</h2>
      </div>
      <div className="divide-y">
        {statements.map((statement) => (
          <div key={statement.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">
                  {statement.date.toLocaleDateString()}
                </p>
                <p className="font-medium">{statement.description}</p>
              </div>
              <div className="text-right">
                <p
                  className={`font-medium ${
                    statement.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {statement.amount > 0 ? "+" : ""}
                  RD$ {statement.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Balance: RD$ {statement.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
