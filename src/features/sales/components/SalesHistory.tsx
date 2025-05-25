import { useState, useEffect } from "react";
import { Sale } from "../types";
import { SaleDetailsModal } from "./SaleDetailsModal";
import { generateInvoicePDF } from "./InvoicePDF";
import { useClientStore } from "../../../stores/clientStore";
import { Product } from "../../inventory/types";
import { getProducts } from "../../inventory/services";

interface SalesHistoryProps {
  sales: Sale[];
  isLoading?: boolean;
  error?: Error | null;
  onCreateCreditNote?: (sale?: Sale) => void;
}

export function SalesHistory({
  sales,
  isLoading,
  error,
  onCreateCreditNote,
}: SalesHistoryProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const clients = useClientStore((state) => state.clients);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const inventoryProducts = await getProducts();
        setProducts(inventoryProducts);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    loadProducts();
  }, []);

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.nombre : `Producto ${productId}`;
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : clientId;
  };

  const handlePrintInvoice = (sale: Sale) => {
    const client = clients.find((c) => c.id === sale.clientId);
    if (client) {
      generateInvoicePDF({ sale, client });
    }
  };

  // Filtrar ventas basado en los criterios
  const filteredSales = sales.filter((sale) => {
    // Filtro por búsqueda
    const clientName = getClientName(sale.clientId).toLowerCase();
    const searchMatch =
      searchTerm === "" ||
      clientName.includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(sale.date).toLocaleDateString().includes(searchTerm);

    // Filtro por estado
    const statusMatch = filterStatus === "all" || sale.status === filterStatus;

    // Filtro por tipo
    const typeMatch = filterType === "all" || sale.type === filterType;

    return searchMatch && statusMatch && typeMatch;
  });

  // Ordenar ventas
  const sortedSales = [...filteredSales].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "client":
        comparison = getClientName(a.clientId).localeCompare(
          getClientName(b.clientId)
        );
        break;
      case "total":
        comparison = a.total - b.total;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Toggler para cambiar la dirección de ordenamiento
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 m-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error al cargar el historial de ventas: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sin ventas
  if (sales.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">
          No hay ventas registradas
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Las ventas que realice aparecerán aquí.
        </p>
      </div>
    );
  }

  // Renderizado normal
  return (
    <>
      {/* Barra de filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 items-end">
          {/* Búsqueda */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Cliente, ID o fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Filtro por estado */}
          <div>
            <label
              htmlFor="filter-status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Estado
            </label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completadas</option>
              <option value="partial">Parciales</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          {/* Filtro por tipo */}
          <div>
            <label
              htmlFor="filter-type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tipo
            </label>
            <select
              id="filter-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
            >
              <option value="all">Todos los tipos</option>
              <option value="cash">Contado</option>
              <option value="credit">Crédito</option>
              <option value="mixed">Mixta</option>
            </select>
          </div>

          {/* Ordenamiento */}
          <div>
            <label
              htmlFor="sort-by"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ordenar por
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => toggleSort(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
            >
              <option value="date">Fecha</option>
              <option value="client">Cliente</option>
              <option value="total">Total</option>
              <option value="status">Estado</option>
            </select>
          </div>

          {/* Dirección */}
          <div>
            <label
              htmlFor="sort-direction"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Dirección
            </label>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => setSortDirection("desc")}
                className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium focus:outline-none ${
                  sortDirection === "desc"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                Descendente
              </button>
              <button
                type="button"
                onClick={() => setSortDirection("asc")}
                className={`flex-1 py-2 px-3 border rounded-md text-sm font-medium focus:outline-none ${
                  sortDirection === "asc"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                Ascendente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center">
                  <span>Fecha</span>
                  {sortBy === "date" && (
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          sortDirection === "asc"
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => toggleSort("client")}
              >
                <div className="flex items-center">
                  <span>Cliente</span>
                  {sortBy === "client" && (
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          sortDirection === "asc"
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Productos
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => toggleSort("total")}
              >
                <div className="flex items-center">
                  <span>Total</span>
                  {sortBy === "total" && (
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          sortDirection === "asc"
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedSales.map((sale) => (
              <tr
                key={sale.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(sale.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(sale.date).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {getClientName(sale.clientId)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {sale.clientId.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {sale.items.length}{" "}
                    {sale.items.length === 1 ? "producto" : "productos"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {sale.items
                      .map((item) => getProductName(item.productId))
                      .join(", ")}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${sale.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ITBIS: ${sale.itbis.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status === "completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : sale.status === "partial"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                          : sale.status === "pending"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {sale.status === "completed"
                      ? "Completada"
                      : sale.status === "partial"
                        ? "Parcial"
                        : sale.status === "pending"
                          ? "Pendiente"
                          : "Cancelada"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {sale.type === "cash"
                      ? "Contado"
                      : sale.type === "credit"
                        ? "Crédito"
                        : "Mixta"}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handlePrintInvoice(sale)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                      title="Imprimir Factura"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                    {onCreateCreditNote && (
                      <button
                        onClick={() => onCreateCreditNote(sale)}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                        title="Crear Nota de Crédito"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje de resultados */}
      {filteredSales.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
          Mostrando {filteredSales.length} de {sales.length} ventas
          {filterStatus !== "all" && (
            <span>
              {" "}
              con estado{" "}
              {filterStatus === "completed"
                ? "completada"
                : filterStatus === "partial"
                  ? "parcial"
                  : filterStatus === "pending"
                    ? "pendiente"
                    : "cancelada"}
            </span>
          )}
          {filterType !== "all" && (
            <span>
              {" "}
              de tipo{" "}
              {filterType === "cash"
                ? "contado"
                : filterType === "credit"
                  ? "crédito"
                  : "mixta"}
            </span>
          )}
          {searchTerm && <span> que coinciden con "{searchTerm}"</span>}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </>
  );
}
