import { useState } from "react";
import { Product } from "../types";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "../hooks";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      codigo: formData.get("codigo") as string,
      nombre: formData.get("nombre") as string,
      descripcion: formData.get("descripcion") as string,
      precio: parseFloat(formData.get("precio") as string),
      stock: parseFloat(formData.get("stock") as string),
      stockMinimo: parseFloat(formData.get("stockMinimo") as string),
      stockMaximo: parseFloat(formData.get("stockMaximo") as string),
      categoria: formData.get("categoria") as string,
      unidad: formData.get("unidad") as string,
      estado: "activo" as const,
    };

    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        product: productData,
      });
      setEditingProduct(null);
    } else {
      await createProduct.mutateAsync(productData);
      setIsAddingProduct(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lista de Productos</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nuevo Producto
        </button>
      </div>

      {/* Formulario de Producto */}
      {(isAddingProduct || editingProduct) && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm">Código</label>
              <input
                type="text"
                name="codigo"
                defaultValue={editingProduct?.codigo}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Nombre</label>
              <input
                type="text"
                name="nombre"
                defaultValue={editingProduct?.nombre}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Descripción</label>
              <textarea
                name="descripcion"
                defaultValue={editingProduct?.descripcion}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Precio</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                defaultValue={editingProduct?.precio}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Stock</label>
              <input
                type="number"
                step="0.01"
                name="stock"
                defaultValue={editingProduct?.stock}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Stock Mínimo</label>
              <input
                type="number"
                step="0.01"
                name="stockMinimo"
                defaultValue={editingProduct?.stockMinimo}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Stock Máximo</label>
              <input
                type="number"
                step="0.01"
                name="stockMaximo"
                defaultValue={editingProduct?.stockMaximo}
                required
                min="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Categoría</label>
              <input
                type="text"
                name="categoria"
                defaultValue={editingProduct?.categoria}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Unidad</label>
              <input
                type="text"
                name="unidad"
                defaultValue={editingProduct?.unidad}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingProduct ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Productos */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.codigo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.precio.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.categoria}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
