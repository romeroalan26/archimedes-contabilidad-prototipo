import { useState } from "react";
import { Product } from "../types";
import { useCreateProduct, useUpdateProduct, useCategories } from "../hooks";
import { UNIDADES_MEDIDA } from "../constants";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState(product?.unidad || "unidad");

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const productData = {
        codigo: formData.get("codigo") as string,
        nombre: formData.get("nombre") as string,
        descripcion: formData.get("descripcion") as string,
        categoria: formData.get("categoria") as string,
        precioCompra: parseFloat(formData.get("precioCompra") as string),
        precioVenta: parseFloat(formData.get("precioVenta") as string),
        stock: parseFloat(formData.get("stock") as string),
        stockMinimo: parseFloat(formData.get("stockMinimo") as string),
        unidad: formData.get("unidad") as string,
        ubicacion: formData.get("ubicacion") as string,
        estado: "activo" as const,
      };

      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: productData,
        });
      } else {
        await createProduct.mutateAsync(productData);
      }

      onClose();
    } catch (err) {
      setError("Error al guardar el producto");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedUnitDetails = UNIDADES_MEDIDA.find(
    (u) => u.id === selectedUnit
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                name="codigo"
                defaultValue={product?.codigo}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                defaultValue={product?.nombre}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                defaultValue={product?.descripcion}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoria"
                defaultValue={product?.categoria}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.nombre}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                name="ubicacion"
                defaultValue={product?.ubicacion}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Compra
              </label>
              <input
                type="number"
                name="precioCompra"
                defaultValue={product?.precioCompra}
                step="0.01"
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta
              </label>
              <input
                type="number"
                name="precioVenta"
                defaultValue={product?.precioVenta}
                step="0.01"
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Actual
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={product?.stock}
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                name="stockMinimo"
                defaultValue={product?.stockMinimo}
                min="0"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Medida
              </label>
              <select
                name="unidad"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {UNIDADES_MEDIDA.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.label}
                  </option>
                ))}
              </select>
              {selectedUnitDetails && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedUnitDetails.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
