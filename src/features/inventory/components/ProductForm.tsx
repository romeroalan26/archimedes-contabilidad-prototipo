import { useState, useEffect } from "react";
import { Product } from "../types";
import { useCreateProduct, useUpdateProduct } from "../hooks";
import { getCategories } from "../services";
import { UNIDADES_MEDIDA } from "../constants";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [categories, setCategories] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState(product?.unidad || "unidad");
  const [showUnitDescription, setShowUnitDescription] = useState(false);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Error al cargar categorías");
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

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
        precio: parseFloat(formData.get("precio") as string),
        stock: parseFloat(formData.get("stock") as string),
        stockMinimo: parseFloat(formData.get("stockMinimo") as string),
        stockMaximo: parseFloat(formData.get("stockMaximo") as string),
        categoria: formData.get("categoria") as string,
        unidad: formData.get("unidad") as string,
        estado: "activo" as const,
      };

      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          product: productData,
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {product ? "Editar Producto" : "Nuevo Producto"}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
              Precio
            </label>
            <input
              type="number"
              name="precio"
              defaultValue={product?.precio}
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
              Stock Máximo
            </label>
            <input
              type="number"
              name="stockMaximo"
              defaultValue={product?.stockMaximo}
              min="0"
              required
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad de Medida
              <button
                type="button"
                className="ml-2 text-gray-400 hover:text-gray-600"
                onMouseEnter={() => setShowUnitDescription(true)}
                onMouseLeave={() => setShowUnitDescription(false)}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
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
            {showUnitDescription && selectedUnitDetails && (
              <div className="absolute z-10 mt-1 w-full p-2 bg-gray-100 border border-gray-200 rounded-md shadow-lg text-sm text-gray-600">
                {selectedUnitDetails.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : product ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
