import { Product } from "../types";

interface InventoryListProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function InventoryList({
  products,
  isLoading,
  error,
}: InventoryListProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Inventario General</h3>
        <p>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Inventario General</h3>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Inventario General</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Código</th>
            <th>Producto</th>
            <th>Unidad</th>
            <th>Stock</th>
            <th>Stock Mínimo</th>
            <th>Stock Máximo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              <td className="py-1">{product.codigo}</td>
              <td>{product.nombre}</td>
              <td>{product.unidad}</td>
              <td>{product.stock}</td>
              <td>{product.stockMinimo}</td>
              <td>{product.stockMaximo}</td>
              <td>
                {product.stock <= product.stockMinimo ? (
                  <span className="text-red-600">Bajo</span>
                ) : product.stock >= product.stockMaximo ? (
                  <span className="text-yellow-600">Alto</span>
                ) : (
                  <span className="text-green-600">Normal</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
