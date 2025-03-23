import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { PayrollForm } from "../components/forms/PayrollForm";
import { PayrollSummary } from "../components/summary/PayrollSummary";
import { EmployeeList } from "../components/lists/EmployeeList";

export function PayrollPage() {
  const [activeTab, setActiveTab] = useState<"form" | "list" | "summary">("form");

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nómina</h1>
        <Link
          to="/nomina/historial"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Historial
        </Link>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "form"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Nueva Nómina
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Empleados
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "summary"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Resumen
        </button>
      </div>

      <div>
        {activeTab === "form" && <PayrollForm />}
        {activeTab === "list" && <EmployeeList />}
        {activeTab === "summary" && <PayrollSummary />}
      </div>

      <Outlet />
    </div>
  );
} 