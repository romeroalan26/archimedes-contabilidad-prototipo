import { useState } from "react";
import { PayrollForm } from "./PayrollForm";
import { EmployeeList } from "./EmployeeList";
import { PayrollSummary } from "./PayrollSummary";

export function PayrollPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nómina y TSS</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          {showForm ? "Cancelar" : "Nuevo Empleado"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <PayrollForm />
        </div>
      )}

      <div className="space-y-6">
        <PayrollSummary />
        <EmployeeList />
      </div>
    </div>
  );
}
