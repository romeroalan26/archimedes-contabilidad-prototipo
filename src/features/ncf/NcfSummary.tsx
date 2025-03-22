export default function NcfSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total NCF</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">Total Ventas</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">$0.00</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">NCF Pendientes</h3>
        <p className="mt-2 text-3xl font-semibold text-yellow-600">0</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-500">NCF Anulados</h3>
        <p className="mt-2 text-3xl font-semibold text-red-600">0</p>
      </div>
    </div>
  );
}
