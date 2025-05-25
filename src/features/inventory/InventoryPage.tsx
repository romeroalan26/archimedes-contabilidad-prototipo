import { useState } from "react";
import {
  useProducts,
  useMovements,
  useStockAlerts,
  useCreateMovement,
} from "./hooks";
import ProductList from "./components/ProductList";
import StockAlerts from "./components/StockAlerts";
import InventoryMovement from "./components/InventoryMovement";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<
    "products" | "movements" | "alerts"
  >("products");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states for ProductList
  const [productFilters, setProductFilters] = useState({
    searchTerm: "",
    selectedCategory: "",
    stockFilter: "all" as "all" | "low" | "out",
  });

  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: movements = [], isLoading: isLoadingMovements } =
    useMovements();
  const { data: alerts = [], isLoading: isLoadingAlerts } = useStockAlerts();

  const createMovement = useCreateMovement();

  // Apply product filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre
        .toLowerCase()
        .includes(productFilters.searchTerm.toLowerCase()) ||
      product.codigo
        .toLowerCase()
        .includes(productFilters.searchTerm.toLowerCase());

    const matchesCategory =
      productFilters.selectedCategory === "" ||
      product.categoria === productFilters.selectedCategory;

    const matchesStock =
      productFilters.stockFilter === "all" ||
      (productFilters.stockFilter === "low" &&
        product.stock <= product.stockMinimo) ||
      (productFilters.stockFilter === "out" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleProductFiltersChange = (newFilters: typeof productFilters) => {
    setProductFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (isLoadingProducts || isLoadingMovements || isLoadingAlerts) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleMovementSubmit = async (data: any) => {
    await createMovement.mutateAsync({
      ...data,
      productId: parseInt(data.productId),
      cantidad: parseFloat(data.cantidad),
      precioUnitario: parseFloat(data.precioUnitario || 0),
      referencia: data.referencia || "",
      fecha: new Date().toISOString().split("T")[0],
      usuario: "Sistema",
    });
  };

  // Pagination logic
  const getCurrentPageItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  // Get paginated data based on active tab
  const getPaginatedData = () => {
    switch (activeTab) {
      case "products":
        return {
          items: getCurrentPageItems(filteredProducts),
          totalItems: filteredProducts.length,
          totalPages: getTotalPages(filteredProducts.length),
        };
      case "movements":
        return {
          items: getCurrentPageItems(movements),
          totalItems: movements.length,
          totalPages: getTotalPages(movements.length),
        };
      case "alerts":
        return {
          items: getCurrentPageItems(alerts),
          totalItems: alerts.length,
          totalPages: getTotalPages(alerts.length),
        };
      default:
        return { items: [], totalItems: 0, totalPages: 0 };
    }
  };

  const paginatedData = getPaginatedData();

  // Reset to page 1 when changing tabs
  const handleTabChange = (newTab: typeof activeTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
  };

  const tabs = [
    {
      key: "products",
      label: "Productos",
      count: filteredProducts.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      key: "movements",
      label: "Movimientos",
      count: movements.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
    },
    {
      key: "alerts",
      label: "Alertas de Stock",
      count: alerts.length,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.634 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
    },
  ];

  // Pagination Component
  const PaginationComponent = () => {
    // Always show pagination info, even for single page
    return (
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(paginatedData.totalPages, currentPage + 1)
                )
              }
              disabled={currentPage === paginatedData.totalPages}
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    paginatedData.totalItems
                  )}
                </span>{" "}
                de{" "}
                <span className="font-medium">{paginatedData.totalItems}</span>{" "}
                resultados
              </p>
            </div>
            {paginatedData.totalPages > 1 && (
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {[...Array(paginatedData.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;

                    // Show first page, last page, current page, and pages around current
                    const shouldShow =
                      pageNumber === 1 ||
                      pageNumber === paginatedData.totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1;

                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isCurrentPage
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(paginatedData.totalPages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === paginatedData.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tus productos y controla el stock en tiempo real
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {/* Add filter controls here */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-0" aria-label="Tabs">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as any)}
                  className={`
                    relative flex-1 group inline-flex items-center justify-center py-4 px-6 text-sm font-medium transition-all duration-200
                    ${index === 0 ? "rounded-tl-lg" : ""} 
                    ${index === tabs.length - 1 ? "rounded-tr-lg" : ""}
                    ${
                      activeTab === tab.key
                        ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-b-2 border-transparent"
                    }
                  `}
                >
                  {/* Active tab indicator */}
                  {activeTab === tab.key && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500"></div>
                  )}

                  <span
                    className={`mr-3 ${
                      activeTab === tab.key
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  <span className="truncate">{tab.label}</span>

                  {tab.count > 0 && (
                    <span
                      className={`ml-3 py-1 px-2.5 rounded-full text-xs font-medium transition-colors ${
                        activeTab === tab.key
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "products" && (
              <div className="space-y-4">
                <ProductList
                  products={paginatedData.items}
                  allProducts={products}
                  searchTerm={productFilters.searchTerm}
                  selectedCategory={productFilters.selectedCategory}
                  stockFilter={productFilters.stockFilter}
                  onFiltersChange={handleProductFiltersChange}
                />
              </div>
            )}

            {activeTab === "movements" && (
              <div className="space-y-6">
                <InventoryMovement
                  products={products}
                  onSubmit={handleMovementSubmit}
                  isLoading={createMovement.isPending}
                  error={createMovement.error}
                />

                {/* Historial de Movimientos */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Historial de Movimientos
                  </h3>

                  {paginatedData.items.length > 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cantidad
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio Unit.
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Motivo
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedData.items.map((movement: any) => {
                              const product = products.find(
                                (p) => p.id === movement.productId
                              );
                              return (
                                <tr
                                  key={movement.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(
                                      movement.fecha
                                    ).toLocaleDateString("es-DO")}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {product?.nombre}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {product?.codigo}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        movement.tipo === "entrada"
                                          ? "bg-green-100 text-green-800"
                                          : movement.tipo === "salida"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {movement.tipo.charAt(0).toUpperCase() +
                                        movement.tipo.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {movement.cantidad.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Intl.NumberFormat("es-DO", {
                                      style: "currency",
                                      currency: "DOP",
                                    }).format(movement.precioUnitario)}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {movement.motivo}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {movement.usuario}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No hay movimientos
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Comienza registrando un movimiento de inventario.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="space-y-4">
                <StockAlerts alerts={paginatedData.items} products={products} />
              </div>
            )}
          </div>

          {/* Pagination */}
          <PaginationComponent />
        </div>
      </div>
    </div>
  );
}
