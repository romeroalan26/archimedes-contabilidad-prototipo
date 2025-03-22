export default function PurchasesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Compras</h2>
      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Nueva Compra
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-500">No hay compras registradas</p>
        </div>
      </div>
    </div>
  );
}
