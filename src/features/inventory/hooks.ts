import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, Category, InventoryFilter } from "./types";
import {
  productService,
  categoryService,
  movementService,
  alertService,
  statsService,
} from "./services";
import { useState } from "react";

// Hook para productos
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productService.getAll,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
};

// Hook para categorías
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
    },
  });
};

// Hook para movimientos
export const useMovements = () => {
  return useQuery({
    queryKey: ["movements"],
    queryFn: movementService.getAll,
  });
};

export const useProductMovements = (productId: number) => {
  return useQuery({
    queryKey: ["movements", productId],
    queryFn: () => movementService.getByProductId(productId),
    enabled: !!productId,
  });
};

export const useCreateMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: movementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-stats"] });
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
};

// Hook para alertas de stock
export const useStockAlerts = () => {
  return useQuery({
    queryKey: ["stock-alerts"],
    queryFn: alertService.generateAlerts,
  });
};

// Hook para estadísticas
export const useInventoryStats = () => {
  return useQuery({
    queryKey: ["inventory-stats"],
    queryFn: statsService.getInventoryStats,
  });
};

// Hook para filtros de productos
export const useProductFilter = (products: Product[]) => {
  const [filter, setFilter] = useState<InventoryFilter>({
    categoria: "all",
    estado: "all",
    stockBajo: false,
    busqueda: "",
  });

  const filteredProducts =
    products?.filter((product) => {
      // Filtro por categoría
      if (
        filter.categoria &&
        filter.categoria !== "all" &&
        product.categoria !== filter.categoria
      ) {
        return false;
      }

      // Filtro por estado
      if (
        filter.estado &&
        filter.estado !== "all" &&
        product.estado !== filter.estado
      ) {
        return false;
      }

      // Filtro por stock bajo
      if (filter.stockBajo && product.stock > product.stockMinimo) {
        return false;
      }

      // Filtro por búsqueda
      if (filter.busqueda) {
        const searchTerm = filter.busqueda.toLowerCase();
        const matchesSearch =
          product.nombre.toLowerCase().includes(searchTerm) ||
          product.codigo.toLowerCase().includes(searchTerm) ||
          product.descripcion.toLowerCase().includes(searchTerm);

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    }) || [];

  const updateFilter = (newFilter: Partial<InventoryFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const clearFilter = () => {
    setFilter({
      categoria: "all",
      estado: "all",
      stockBajo: false,
      busqueda: "",
    });
  };

  return {
    filter,
    filteredProducts,
    updateFilter,
    clearFilter,
    hasActiveFilters:
      filter.categoria !== "all" ||
      filter.estado !== "all" ||
      filter.stockBajo ||
      filter.busqueda !== "",
  };
};
