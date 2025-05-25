import { useState } from "react";
import { Product } from "../types";
import { useDeleteProduct } from "../hooks";
import ProductForm from "./ProductForm";

interface ProductListProps {
  products: Product[];
  onFiltersChange?: (filters: {
    searchTerm: string;
    selectedCategory: string;
    stockFilter: "all" | "low" | "out";
  }) => void;
  searchTerm?: string;
  selectedCategory?: string;
  stockFilter?: "all" | "low" | "out";
  allProducts?: Product[]; // For getting categories
}

export default function ProductList({
  products,
  onFiltersChange,
  searchTerm = "",
  selectedCategory = "",
  stockFilter = "all",
  allProducts = [],
}: ProductListProps) {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este producto?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  // Obtener categorías únicas de todos los productos (no solo los paginados)
  const categories = Array.from(
    new Set(allProducts.map((product) => product.categoria))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(amount);
  };

  const handleFilterChange = (
    newFilters: Partial<{
      searchTerm: string;
      selectedCategory: string;
      stockFilter: "all" | "low" | "out";
    }>
  ) => {
    if (onFiltersChange) {
      onFiltersChange({
        searchTerm,
        selectedCategory,
        stockFilter,
        ...newFilters,
      });
    }
  };

  // Product Card Component (Mobile/Tablet view)
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 text-sm">
              {product.nombre}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.codigo}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {product.descripcion}
          </p>
        </div>
        <div className="flex space-x-1 ml-3">
          <button
            onClick={() => setEditingProduct(product)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
            title="Editar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            title="Eliminar"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-gray-500">Categoría:</span>
          <span className="ml-1 text-gray-900">{product.categoria}</span>
        </div>
        <div>
          <span className="text-gray-500">Precio:</span>
          <span className="ml-1 text-gray-900 font-medium">
            {formatCurrency(product.precioVenta)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Stock:</span>
          <div className="ml-1 inline-flex items-center gap-1">
            <span className="text-gray-900">
              {product.stock} {product.unidad}
            </span>
            {product.stock <= product.stockMinimo && product.stock > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Bajo
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                Agotado
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Estado:</span>
          <span
            className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
              product.estado === "activo"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {product.estado}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">Ubicación: </span>
        <span className="text-xs text-gray-900">{product.ubicacion}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm font-medium"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) =>
                handleFilterChange({ searchTerm: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) =>
                handleFilterChange({ selectedCategory: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Stock
            </label>
            <select
              value={stockFilter}
              onChange={(e) =>
                handleFilterChange({
                  stockFilter: e.target.value as "all" | "low" | "out",
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="all">Todos</option>
              <option value="low">Stock Bajo</option>
              <option value="out">Sin Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory || stockFilter !== "all"
              ? "Intenta ajustar los filtros o busca otros términos."
              : "Comienza agregando tu primer producto."}
          </p>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            + Agregar Producto
          </button>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.nombre}
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
                              {product.codigo}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {product.descripcion}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            📍 {product.ubicacion}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {product.categoria}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(product.precioVenta)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {product.stock} {product.unidad}
                          </span>
                          {product.stock <= product.stockMinimo &&
                            product.stock > 0 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                Bajo
                              </span>
                            )}
                          {product.stock === 0 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Agotado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.estado === "activo"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal para agregar producto */}
      {isAddingProduct && (
        <ProductForm onClose={() => setIsAddingProduct(false)} />
      )}

      {/* Modal para editar producto */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
