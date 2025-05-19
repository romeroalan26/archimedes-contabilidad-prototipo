import { useState } from "react";
import NcfForm from "./NcfForm";
import NcfList from "./NcfList";
import NcfSummary from "./NcfSummary";

export function NCFPage() {
  const [showForm, setShowForm] = useState(false);
  const [ncfList] = useState([]);

  const handleSubmit = (data: any) => {
    console.log("NCF submitted:", data);
    setShowForm(false);
  };

  const handleFiltersChange = (_: any) => {
    // Process filters here
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Comprobantes Fiscales (NCF)
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          {showForm ? "Cancelar" : "Nuevo NCF"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <NcfForm onSubmit={handleSubmit} />
        </div>
      )}

      <div className="space-y-6">
        <NcfSummary />
        <NcfList ncfList={ncfList} onFiltersChange={handleFiltersChange} />
      </div>
    </div>
  );
}
