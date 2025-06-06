import { useState } from "react";
import { BankOperations } from "./BankOperations";
import { CashFlow } from "./CashFlow";
import { BankReconciliation } from "./BankReconciliation";

type Tab = "operations" | "cashflow" | "reconciliation";

export function TreasuryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("operations");

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("operations")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "operations"
              ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          Operaciones Bancarias
        </button>
        <button
          onClick={() => setActiveTab("cashflow")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "cashflow"
              ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          Flujo de Caja
        </button>
        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "reconciliation"
              ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          Conciliación Bancaria
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "operations" && <BankOperations />}
        {activeTab === "cashflow" && <CashFlow />}
        {activeTab === "reconciliation" && <BankReconciliation />}
      </div>
    </div>
  );
}
