import {
  Product,
  InventoryMovement,
  Category,
  StockAlert,
  InventoryReport,
} from "./types";
import {
  mockProducts,
  mockMovements,
  mockCategories,
  mockStockAlerts,
  mockInventoryReport,
} from "./mockData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Productos
export const getProducts = async (): Promise<Product[]> => {
  await delay(500);
  return mockProducts;
};

export const getProductById = async (
  id: number
): Promise<Product | undefined> => {
  await delay(300);
  return mockProducts.find((p) => p.id === id);
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> => {
  await delay(500);
  const newProduct: Product = {
    ...product,
    id: mockProducts.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  await delay(500);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");

  mockProducts[index] = {
    ...mockProducts[index],
    ...product,
    updatedAt: new Date().toISOString(),
  };
  return mockProducts[index];
};

export const deleteProduct = async (id: number): Promise<void> => {
  await delay(500);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Producto no encontrado");
  mockProducts.splice(index, 1);
};

// Movimientos
export const getMovements = async (): Promise<InventoryMovement[]> => {
  await delay(500);
  return mockMovements;
};

export const createMovement = async (
  movement: Omit<InventoryMovement, "id" | "createdAt">
): Promise<InventoryMovement> => {
  await delay(500);
  const newMovement: InventoryMovement = {
    ...movement,
    id: mockMovements.length + 1,
    createdAt: new Date().toISOString(),
  };
  mockMovements.push(newMovement);

  // Actualizar stock del producto
  const product = mockProducts.find((p) => p.id === movement.productId);
  if (product) {
    product.stock +=
      movement.tipo === "entrada" ? movement.cantidad : -movement.cantidad;
    product.updatedAt = new Date().toISOString();
  }

  return newMovement;
};

// Categorías
export const getCategories = async (): Promise<Category[]> => {
  await delay(500);
  return mockCategories;
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  await delay(500);
  const newCategory: Category = {
    ...category,
    id: mockCategories.length + 1,
  };
  mockCategories.push(newCategory);
  return newCategory;
};

// Alertas de Stock
export const getStockAlerts = async (): Promise<StockAlert[]> => {
  await delay(500);
  return mockStockAlerts;
};

// Reportes
export const getInventoryReport = async (): Promise<InventoryReport> => {
  await delay(800);
  return mockInventoryReport;
};
